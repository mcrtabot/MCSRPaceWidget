package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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
        // ホームディレクトリ(~/mcsrpacewidget)に対象パスがあればそちらを優先
        // If there is a target path in the home directory (~/mcsrpacewidget),
        // prioritize it
        String separator = File.separator;
        String homeWidgetPath = System.getProperty("user.home") + separator + "mcsrpacewidget";
        if (path != null) {
            homeWidgetPath += separator + path;
        }

        return new File(homeWidgetPath);
    }
}
