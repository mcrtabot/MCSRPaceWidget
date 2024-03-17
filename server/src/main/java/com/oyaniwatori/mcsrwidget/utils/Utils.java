package com.oyaniwatori.mcsrwidget.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.oyaniwatori.mcsrwidget.Theme;

public class Utils {
    public static Theme[] getThemes() {
        List<Theme> themes = new ArrayList<Theme>();
        File[] files = new File("theme").listFiles();
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
}
