package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.JarURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.CodeSource;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.regex.Pattern;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import com.oyaniwatori.mcsrwidget.Environment;
import com.oyaniwatori.mcsrwidget.IconSet;
import com.oyaniwatori.mcsrwidget.PaceItem;
import com.oyaniwatori.mcsrwidget.Player;
import com.oyaniwatori.mcsrwidget.Theme;

public class Utils {
    private static final String DEFAULT_THEME = "default";

    /** 起動時にホームへ配る配布物のディレクトリ */
    private static final List<String> DEFAULT_RESOURCE_DIRS = Arrays.asList("theme", "setting", "icon");

    /** 前回ホームへ配った配布物の指紋を置くファイル */
    private static final String INSTALLED_DIGESTS = ".installed.json";

    private static final Pattern UUID_PATTERN = Pattern
            .compile("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

    /** <dir>/ 直下のディレクトリ名。ホーム → 配布物 → jar 同梱 の和集合 */
    private static Set<String> listResourceDirs(String dir) {
        Set<String> names = new TreeSet<String>();
        for (File base : new File[] { getHomeResourceDir(dir), getAppResourceDir(dir) }) {
            File[] files = base.listFiles();
            if (files == null) {
                continue;
            }
            for (File file : files) {
                if (file.isDirectory()) {
                    names.add(file.getName());
                }
            }
        }
        names.addAll(listBundledDirs(dir));
        return names;
    }

    /** jar に同梱した <dir>/ 直下のディレクトリ名。IDE から動かすと file: になるのでそちらも見る */
    private static Set<String> listBundledDirs(String dir) {
        Set<String> names = new HashSet<String>();
        try {
            URL url = Utils.class.getResource("/" + dir);
            if (url == null) {
                return names;
            }
            if ("file".equals(url.getProtocol())) {
                File[] files = new File(url.toURI()).listFiles();
                if (files != null) {
                    for (File file : files) {
                        if (file.isDirectory()) {
                            names.add(file.getName());
                        }
                    }
                }
                return names;
            }
            // クラスローダと共有しているので閉じない
            JarFile jar = ((JarURLConnection) url.openConnection()).getJarFile();
            String prefix = dir + "/";
            Enumeration<JarEntry> entries = jar.entries();
            while (entries.hasMoreElements()) {
                String rest = entries.nextElement().getName();
                if (!rest.startsWith(prefix)) {
                    continue;
                }
                rest = rest.substring(prefix.length());
                int slash = rest.indexOf('/');
                if (slash > 0) {
                    names.add(rest.substring(0, slash));
                }
            }
        } catch (Exception e) {
            System.out.println("list bundled " + dir + " failed: " + e);
        }
        return names;
    }

    /** <dir>/<path> を ホーム → 配布物 → jar 同梱 の順で開く。無ければ null */
    public static InputStream openResource(String dir, String path) throws IOException {
        // path はリクエスト由来。<dir> の外へ出ないものだけ通す
        String safePath = toSafeResourcePath(path);
        if (safePath == null) {
            return null;
        }
        for (File base : new File[] { getHomeResourceDir(dir), getAppResourceDir(dir) }) {
            File file = new File(base, safePath);
            if (file.isFile()) {
                return new FileInputStream(file);
            }
        }
        return Utils.class.getResourceAsStream("/" + dir + "/" + safePath);
    }

    /** `a//./b` を `a/b` に均す。`..` や絶対パスなど <dir> の外を指すものは null */
    private static String toSafeResourcePath(String path) {
        if (path == null || path.indexOf('\0') >= 0) {
            return null;
        }
        StringBuilder safe = new StringBuilder();
        for (String segment : path.replace('\\', '/').split("/")) {
            if (segment.isEmpty() || ".".equals(segment)) {
                continue;
            }
            if ("..".equals(segment)) {
                return null;
            }
            if (safe.length() > 0) {
                safe.append('/');
            }
            safe.append(segment);
        }
        return safe.length() == 0 ? null : safe.toString();
    }

    private static boolean hasResource(String dir, String path) {
        try (InputStream in = openResource(dir, path)) {
            return in != null;
        } catch (IOException e) {
            return false;
        }
    }

    public static Theme[] getThemes() {
        List<Theme> themes = new ArrayList<Theme>();
        for (String name : listResourceDirs("theme")) {
            themes.add(new Theme(name, hasResource("theme", name + "/timeline.css"),
                    hasResource("theme", name + "/indicator.css"), hasResource("theme", name + "/segment.css")));
        }
        // 名前順。ただし default は最初に置く。迷ったときの出発点になるテーマなので
        Collections.sort(themes, new Comparator<Theme>() {
            public int compare(Theme t1, Theme t2) {
                if (t1.name.equals(t2.name)) {
                    return 0;
                }
                if (DEFAULT_THEME.equals(t1.name)) {
                    return -1;
                }
                if (DEFAULT_THEME.equals(t2.name)) {
                    return 1;
                }
                return t1.name.compareTo(t2.name);
            }
        });

        return themes.toArray(new Theme[themes.size()]);
    }

    public static IconSet[] getIconSets() {
        List<IconSet> iconSets = new ArrayList<IconSet>();
        ObjectMapper mapper = new ObjectMapper();
        for (String id : listResourceDirs("icon")) {
            try (InputStream in = openResource("icon", id + "/icons.json")) {
                if (in == null) {
                    continue;
                }
                JsonNode json = mapper.readTree(in);
                JsonNode iconsNode = json.get("icons");
                if (iconsNode == null) {
                    continue;
                }
                Map<String, String> icons = new LinkedHashMap<String, String>();
                Iterator<Map.Entry<String, JsonNode>> fields = iconsNode.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    // `//` 始まりは JSON にコメントを書くための慣習。スプリット種別ではない
                    if (entry.getKey().startsWith("//")) {
                        continue;
                    }
                    icons.put(entry.getKey(), entry.getValue().asText());
                }

                JsonNode nameNode = json.get("name");
                String name = nameNode != null ? nameNode.asText() : id;

                iconSets.add(new IconSet(id, name, icons));
            } catch (IOException e) {
                // 壊れたセットは一覧から落とすだけにして、他のセットは返す
                // Skip a broken set rather than failing the whole listing
                System.out.println("load icon set failed: " + id);
            }
        }
        Collections.sort(iconSets, new Comparator<IconSet>() {
            public int compare(IconSet i1, IconSet i2) {
                return i1.id.compareTo(i2.id);
            }
        });

        return iconSets.toArray(new IconSet[iconSets.size()]);
    }

    public static File getHomeResourceDir(String path) {
        // ホームディレクトリのコンフィグフォルダに(~/.config/MCSRPaceWidget)に対象パスがあればそちらを優先
        // If there is a target path in the home config directory
        // (~/.config/MCSRPaceWidget), prioritize it
        String separator = File.separator;
        String homeWidgetPath = System.getProperty("user.home") + separator + ".config" + separator
                + "MCSRPaceWidget";
        if (path != null) {
            homeWidgetPath += separator + path;
        }

        return new File(homeWidgetPath);
    }

    /**
     * ホームのコンフィグフォルダ (~/.config/MCSRPaceWidget) を起動時に用意する。
     * 無ければ作り、配布物の theme / setting / icon を毎回配り直す。
     * 更新で増えたテーマやアイコンセットを既存の環境にも届けるため。
     * ユーザーが直したファイルは残す。詳しくは syncDefaultResources
     */
    public static void prepareHomeResourceDir() {
        File dir = getHomeResourceDir(null);
        if (!dir.isDirectory() && !dir.mkdirs()) {
            System.out.println("could not create the config directory: " + dir);
            return;
        }

        Map<String, String> installed = loadInstalledDigests(dir);
        Map<String, String> updated = new LinkedHashMap<String, String>(installed);
        for (String name : DEFAULT_RESOURCE_DIRS) {
            try {
                syncDefaultResources(name, new File(dir, name), installed, updated);
            } catch (Exception e) {
                // 配れなかった分は記録を残さない。次の起動でもう一度試す
                System.out.println("could not copy the default " + name + ": " + e);
            }
        }
        saveInstalledDigests(dir, updated);
        Uploads.getDir().mkdirs();
    }

    /**
     * 配布物の <name>/ をホームへ配る。ユーザーが直したファイルには触らない。
     *
     * 前回配ったときの指紋を残しておき、
     * 指紋どおりのファイル = 手つかず とみなして新しい配布物で置き換える。
     * 指紋が違うものはユーザーが直したものとして残す。
     * 消されたファイルは配り直す。消して起動し直せば既定の内容に戻せるように
     */
    private static void syncDefaultResources(String name, final File dest, final Map<String, String> installed,
            final Map<String, String> updated) throws Exception {
        eachDefaultResource(name, new ResourceVisitor() {
            public void visit(String path, InputStream in) throws IOException {
                String key = dest.getName() + "/" + path;
                File file = new File(dest, path);
                // 指紋を知らないファイルも残す。この仕組みが無かった頃からあるものなので
                if (file.isFile() && !digestOf(file).equals(installed.get(key))) {
                    return;
                }

                file.getParentFile().mkdirs();
                Files.copy(in, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                updated.put(key, digestOf(file));
            }
        });
    }

    private interface ResourceVisitor {
        void visit(String path, InputStream in) throws IOException;
    }

    /** 配布物の <name>/ 以下を1ファイルずつ渡す。jar の隣 → カレント → jar の中 の順に探す */
    private static void eachDefaultResource(String name, ResourceVisitor visitor) throws Exception {
        File local = getAppResourceDir(name);
        if (local.isDirectory()) {
            eachFile(local, "", visitor);
            return;
        }

        URL url = Utils.class.getResource("/" + name);
        if (url == null) {
            throw new IOException("no default " + name);
        }
        if ("file".equals(url.getProtocol())) {
            eachFile(new File(url.toURI()), "", visitor);
            return;
        }
        eachJarResource((JarURLConnection) url.openConnection(), name, visitor);
    }

    private static void eachFile(File dir, String prefix, ResourceVisitor visitor) throws IOException {
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }
        for (File file : files) {
            String path = prefix + file.getName();
            if (file.isDirectory()) {
                eachFile(file, path + "/", visitor);
            } else {
                try (InputStream in = new FileInputStream(file)) {
                    visitor.visit(path, in);
                }
            }
        }
    }

    /** jar に同梱した <name>/ 以下を取り出す。Jingle プラグインではここが唯一のコピー元になる */
    private static void eachJarResource(JarURLConnection connection, String name, ResourceVisitor visitor)
            throws IOException {
        // クラスローダと共有しているので閉じない
        JarFile jar = connection.getJarFile();
        String prefix = name + "/";
        Enumeration<JarEntry> entries = jar.entries();
        while (entries.hasMoreElements()) {
            JarEntry entry = entries.nextElement();
            if (entry.isDirectory() || !entry.getName().startsWith(prefix)) {
                continue;
            }
            try (InputStream in = jar.getInputStream(entry)) {
                visitor.visit(entry.getName().substring(prefix.length()), in);
            }
        }
    }

    /** 前回ホームへ配った配布物の指紋 */
    private static Map<String, String> loadInstalledDigests(File dir) {
        File file = new File(dir, INSTALLED_DIGESTS);
        if (!file.isFile()) {
            return Collections.emptyMap();
        }
        try {
            return new ObjectMapper().readValue(file, new TypeReference<LinkedHashMap<String, String>>() {
            });
        } catch (IOException e) {
            System.out.println("load " + INSTALLED_DIGESTS + " failed: " + e);
            return Collections.emptyMap();
        }
    }

    private static void saveInstalledDigests(File dir, Map<String, String> digests) {
        try {
            new ObjectMapper().writeValue(new File(dir, INSTALLED_DIGESTS), digests);
        } catch (IOException e) {
            System.out.println("save " + INSTALLED_DIGESTS + " failed: " + e);
        }
    }

    private static String digestOf(File file) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            byte[] buffer = new byte[8192];
            try (InputStream in = new FileInputStream(file)) {
                int read;
                while ((read = in.read(buffer)) > 0) {
                    digest.update(buffer, 0, read);
                }
            }
            StringBuilder hex = new StringBuilder();
            for (byte b : digest.digest()) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IOException(e);
        }
    }

    /** 配布物側 (jar と同じディレクトリ、無ければカレント) の theme / setting / icon */
    public static File getAppResourceDir(String path) {
        String name = path.startsWith("/") ? path.substring(1) : path;
        File local = new File(getAppDir(), name);
        return local.isDirectory() ? local : new File(name);
    }

    /** jar が置かれているディレクトリ。分からなければカレント */
    private static File getAppDir() {
        try {
            CodeSource source = Utils.class.getProtectionDomain().getCodeSource();
            if (source != null) {
                File location = new File(source.getLocation().toURI());
                return location.isDirectory() ? location : location.getParentFile();
            }
        } catch (Exception e) {
            // 取れない環境ではカレントで探す
        }
        return new File(".");
    }

    // for pace settings utils
    // PB.jsonのロケーションを特定
    public static File getPbJsonLocation() {
        File location;

        File homeSettingFile = new File(getHomeResourceDir("setting").toString() + File.separator + "pb.json");
        if (homeSettingFile.exists()) {
            location = homeSettingFile;
        } else {
            location = new File("setting" + File.separator + "pb.json");
        }

        return location;
    }

    // PB.jsonから現在のペースの設定を取得
    public static List<PaceItem> getPaceItems(File location) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(location, new TypeReference<List<PaceItem>>() {
        });
    }

    // PB.jsonに新しいペースの設定を保存
    public static void savePbJson(File location, List<PaceItem> paceItems) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(location, paceItems);
    }

    /** setting/player.json のロケーションを特定 */
    public static File getPlayerJsonLocation() {
        File homeSettingFile = new File(getHomeResourceDir("setting").toString() + File.separator + "player.json");
        if (homeSettingFile.exists()) {
            return homeSettingFile;
        }
        return new File("setting" + File.separator + "player.json");
    }

    /**
     * スキン顔に使う走者を特定する。優先順は
     * 1. setting/player.json の id（手動指定。別アカウントで配信する場合などの逃げ道）
     * 2. ワールドの stats/<uuid>.json のファイル名（Minecraft が素で置くもの）
     * 3. timer.igt の resultRecord 内 stats のキー
     *
     * 2 と 3 はワールドに入り直した直後などに取れないことがあるため、
     * 呼び出し側は取れた値を覚えておくこと。
     */
    public static Player getPlayer() {
        String fromSetting = getPlayerIdFromSetting();
        if (fromSetting != null) {
            return new Player(fromSetting, "setting");
        }

        String instancePath;
        try {
            instancePath = getInstancePath();
        } catch (IOException e) {
            return null;
        }

        String fromStats = getPlayerUuidFromStats(instancePath);
        if (fromStats != null) {
            return new Player(fromStats, "stats");
        }

        String fromRecord = getPlayerUuidFromRecord(instancePath);
        if (fromRecord != null) {
            return new Player(fromRecord, "record");
        }

        return null;
    }

    private static String getPlayerIdFromSetting() {
        File file = getPlayerJsonLocation();
        if (!file.exists()) {
            return null;
        }
        try {
            JsonNode json = new ObjectMapper().readTree(file);
            JsonNode idNode = json.get("id");
            if (idNode == null || idNode.isNull()) {
                return null;
            }
            String id = idNode.asText().trim();
            return id.isEmpty() ? null : id;
        } catch (IOException e) {
            System.out.println("load player.json failed.");
            return null;
        }
    }

    /** ワールドの stats/<uuid>.json。複数アカウントが遊んだワールドでは特定できないので諦める */
    private static String getPlayerUuidFromStats(String instancePath) {
        File statsDir = new File(instancePath + File.separator + "stats");
        File[] files = statsDir.listFiles();
        if (files == null) {
            return null;
        }

        String uuid = null;
        for (File file : files) {
            String name = file.getName();
            if (!name.endsWith(".json")) {
                continue;
            }
            String candidate = name.substring(0, name.length() - ".json".length());
            if (!UUID_PATTERN.matcher(candidate).matches()) {
                continue;
            }
            if (uuid != null) {
                return null;
            }
            uuid = candidate;
        }
        return uuid;
    }

    /** timer.igt の resultRecord は文字列のJSON。その中の stats のキーが走者のUUID */
    private static String getPlayerUuidFromRecord(String instancePath) {
        String separator = File.separator;
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json;
        try {
            String path = instancePath + separator + "speedrunigt" + separator + "data" + separator + "timer.igt";
            json = mapper.readTree(Crypto.decrypt(FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return null;
        }

        try {
            JsonNode recordNode = json.get("resultRecord");
            if (recordNode == null || recordNode.isNull()) {
                return null;
            }
            JsonNode stats = mapper.readTree(recordNode.asText()).get("stats");
            if (stats == null || stats.size() != 1) {
                return null;
            }
            String uuid = stats.fieldNames().next();
            return UUID_PATTERN.matcher(uuid).matches() ? uuid : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 前提が揃っているかを調べる。
     *
     * SpeedRunIGT の Auto Save Interval が Ticks でないと timer.igt が
     * ポーズ時にしか書かれず、ウィジェットが止まって見える。
     * 設定は SpeedRunOption と同じ手順で探す。インスタンス側の speedrunigt/ に
     * .useglobaloption があればホーム側 (~/speedrunigt/options.txt) を見る。
     */
    public static Environment getEnvironment() {
        String worldPath;
        try {
            worldPath = getInstancePath();
        } catch (IOException e) {
            return new Environment(null, null, null);
        }

        String separator = File.separator;
        // worldPath は <.minecraft>/saves/<ワールド名>
        File minecraftDir = new File(worldPath).getParentFile();
        if (minecraftDir != null) {
            minecraftDir = minecraftDir.getParentFile();
        }
        if (minecraftDir == null) {
            return new Environment(worldPath, null, null);
        }

        File speedrunigtDir = new File(minecraftDir, "speedrunigt");
        File optionsFile;
        if (new File(speedrunigtDir, ".useglobaloption").exists()) {
            optionsFile = new File(System.getProperty("user.home") + separator + "speedrunigt" + separator
                    + "options.txt");
        } else {
            optionsFile = new File(speedrunigtDir, "options.txt");
        }

        if (!optionsFile.exists()) {
            return new Environment(worldPath, null, optionsFile.getAbsolutePath());
        }

        String interval = readOption(optionsFile, "speedrunigt:auto_save_interval:");
        // 既定は PAUSE。一度も触っていなければ行自体が無い
        if (interval == null) {
            interval = "PAUSE";
        }
        return new Environment(worldPath, interval, optionsFile.getAbsolutePath());
    }

    /** options.txt は `名前空間:キー:値` を1行ずつ並べた形式 */
    private static String readOption(File file, String prefix) {
        try {
            for (String line : Files.readAllLines(file.toPath(), StandardCharsets.UTF_8)) {
                if (line.startsWith(prefix)) {
                    return line.substring(prefix.length()).trim();
                }
            }
        } catch (IOException e) {
            System.out.println("could not read " + file.getName());
        }
        return null;
    }

    public static String getInstancePath() throws IOException {
        String separator = File.separator;
        String latestWorldFilePath = System.getProperty("user.home") + separator + "speedrunigt" + separator
                + "latest_world.json";

        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode latestWorldData = mapper.readTree(Paths.get(latestWorldFilePath).toFile());
            return latestWorldData.get("world_path").textValue();
        } catch (JsonParseException e) {
            // 暫定対応
            // JSONパースに失敗する場合は、latest_world.jsonがShift-JISだとして読み込みを試みる
            try (InputStreamReader reader = new InputStreamReader(
                    new FileInputStream(Paths.get(latestWorldFilePath).toFile()), Charset.forName("Shift-JIS"))) {
                JsonNode latestWorldData = mapper.readTree(reader);
                return latestWorldData.get("world_path").textValue();
            }
        }
    }
}
