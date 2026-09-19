package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import com.oyaniwatori.mcsrwidget.IconSet;
import com.oyaniwatori.mcsrwidget.PaceItem;
import com.oyaniwatori.mcsrwidget.Player;
import com.oyaniwatori.mcsrwidget.Theme;

public class Utils {
    private static final Pattern UUID_PATTERN = Pattern
            .compile("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

    public static Theme[] getThemes() {
        File themeDir;

        File homeThemeDir = getHomeResourceDir("theme");
        if (homeThemeDir.exists()) {
            themeDir = homeThemeDir;
        } else {
            themeDir = new File("theme");
        }
        List<Theme> themes = new ArrayList<Theme>();

        File[] files = themeDir.listFiles();
        if (files == null) {
            return new Theme[] {};
        }
        for (int i = 0; i < files.length; i++) {
            File file = files[i];
            if (!file.isDirectory()) {
                continue;
            }
            themes.add(new Theme(file.getName(), new File(file.getPath() + File.separator + "timeline.css").exists(),
                    new File(file.getPath() + File.separator + "indicator.css").exists(),
                    new File(file.getPath() + File.separator + "segment.css").exists()));
        }
        Collections.sort(themes, new Comparator<Theme>() {
            public int compare(Theme t1, Theme t2) {
                return t1.name.compareTo(t2.name);
            }
        });

        return themes.toArray(new Theme[themes.size()]);
    }

    public static IconSet[] getIconSets() {
        File iconDir;

        File homeIconDir = getHomeResourceDir("icon");
        if (homeIconDir.exists()) {
            iconDir = homeIconDir;
        } else {
            iconDir = new File("icon");
        }

        List<IconSet> iconSets = new ArrayList<IconSet>();

        File[] files = iconDir.listFiles();
        if (files == null) {
            return new IconSet[] {};
        }
        ObjectMapper mapper = new ObjectMapper();
        for (File file : files) {
            if (!file.isDirectory()) {
                continue;
            }
            File settingFile = new File(file, "icons.json");
            if (!settingFile.exists()) {
                continue;
            }
            try {
                JsonNode json = mapper.readTree(settingFile);
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
                String name = nameNode != null ? nameNode.asText() : file.getName();

                iconSets.add(new IconSet(file.getName(), name, icons));
            } catch (IOException e) {
                // 壊れたセットは一覧から落とすだけにして、他のセットは返す
                // Skip a broken set rather than failing the whole listing
                System.out.println("load icon set failed: " + file.getName());
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
