package com.oyaniwatori.mcsrwidget;

import java.util.Map;

/**
 * テーマから切り離した共通アイコンセット。
 * icon/<id>/icons.json が「スプリットの種別 -> 同じディレクトリの画像ファイル」を持つ。
 * A shared icon set, independent of themes.
 */
public class IconSet {
    public final String id;
    public final String name;
    public final Map<String, String> icons;

    public IconSet(String id, String name, Map<String, String> icons) {
        this.id = id;
        this.name = name;
        this.icons = icons;
    }
}
