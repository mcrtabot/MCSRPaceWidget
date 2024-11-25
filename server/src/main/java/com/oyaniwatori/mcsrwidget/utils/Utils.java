package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.PaceItem;
import com.oyaniwatori.mcsrwidget.Theme;

public class Utils {
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
                    new File(file.getPath() + File.separator + "indicator.css").exists()));
        }
        Collections.sort(themes, new Comparator<Theme>() {
            public int compare(Theme t1, Theme t2) {
                return t1.name.compareTo(t2.name);
            }
        });

        return themes.toArray(new Theme[themes.size()]);
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
