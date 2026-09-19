package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;

/**
 * テーマで使う画像の置き場。
 *
 * 置き先はホーム側 (~/.config/MCSRPaceWidget/upload) に固定する。
 * 配布物と同じ場所に書くと、widget を入れ替えたときに消えてしまうため。
 */
public class Uploads {
    /** 画像1枚の上限。アイコンや顔に使う想定なので小さくてよい */
    public static final long MAX_SIZE = 2 * 1024 * 1024;

    private static final Pattern SAFE_NAME = Pattern.compile("[^A-Za-z0-9._-]");

    private static final List<String> EXTENSIONS = Arrays.asList(".png", ".jpg", ".jpeg", ".gif", ".webp");

    public static File getDir() {
        return Utils.getHomeResourceDir("upload");
    }

    /** 置いてある画像の一覧。新しいものが先 */
    public static String[] list() {
        File[] files = getDir().listFiles();
        if (files == null) {
            return new String[] {};
        }
        List<File> images = new ArrayList<File>();
        for (File file : files) {
            if (file.isFile() && hasImageExtension(file.getName())) {
                images.add(file);
            }
        }
        Collections.sort(images, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));

        String[] names = new String[images.size()];
        for (int i = 0; i < images.size(); i++) {
            names[i] = images.get(i).getName();
        }
        return names;
    }

    /**
     * アップロードされた一時ファイルを保存し、保存後のファイル名を返す。
     * 受け取った名前はそのまま使わず、記号を落としてから拡張子を検査する。
     */
    public static String save(File temp, String originalName) throws IOException {
        if (temp.length() > MAX_SIZE) {
            throw new IOException("too large");
        }
        if (!isImage(temp)) {
            throw new IOException("not an image");
        }

        String name = sanitize(originalName);
        File dir = getDir();
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("could not create the upload directory");
        }

        File target = new File(dir, name);
        // 同じ名前があっても上書きせず、連番を足す
        int suffix = 1;
        String base = name.substring(0, name.lastIndexOf('.'));
        String ext = name.substring(name.lastIndexOf('.'));
        while (target.exists()) {
            target = new File(dir, base + "-" + suffix + ext);
            suffix++;
        }

        FileUtils.copyFile(temp, target);
        return target.getName();
    }

    private static String sanitize(String originalName) throws IOException {
        String name = originalName == null ? "" : originalName;
        // パス区切りを含む名前で上のディレクトリへ出られないようにする
        name = name.replace('\\', '/');
        name = name.substring(name.lastIndexOf('/') + 1);
        name = SAFE_NAME.matcher(name).replaceAll("_");
        name = name.replaceAll("^[._]+", "");

        if (!hasImageExtension(name)) {
            throw new IOException("unsupported file type");
        }
        if (name.length() > 80) {
            String ext = name.substring(name.lastIndexOf('.'));
            name = name.substring(0, 80 - ext.length()) + ext;
        }
        return name;
    }

    private static boolean hasImageExtension(String name) {
        String lower = name.toLowerCase(Locale.ROOT);
        for (String ext : EXTENSIONS) {
            if (lower.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    /** 拡張子は名乗るだけなので、先頭のバイト列も見る */
    private static boolean isImage(File file) {
        try (InputStream in = Files.newInputStream(file.toPath())) {
            byte[] head = new byte[12];
            if (in.read(head) < 12) {
                return false;
            }
            // PNG
            if ((head[0] & 0xFF) == 0x89 && head[1] == 'P' && head[2] == 'N' && head[3] == 'G') {
                return true;
            }
            // JPEG
            if ((head[0] & 0xFF) == 0xFF && (head[1] & 0xFF) == 0xD8) {
                return true;
            }
            // GIF
            if (head[0] == 'G' && head[1] == 'I' && head[2] == 'F') {
                return true;
            }
            // WebP (RIFF....WEBP)
            if (head[0] == 'R' && head[1] == 'I' && head[2] == 'F' && head[3] == 'F'
                    && head[8] == 'W' && head[9] == 'E' && head[10] == 'B' && head[11] == 'P') {
                return true;
            }
            return false;
        } catch (IOException e) {
            return false;
        }
    }
}
