package com.oyaniwatori.mcsrwidget;

/**
 * スキン顔の取得に使う走者の識別子。
 * id は Minecraft ID か UUID のどちらか（mc-heads はどちらでも引ける）。
 * The runner's identifier, used to fetch the skin face.
 */
public class Player {
    public final String id;
    /** setting / stats / record のどれで解決したか。表示の調査用 */
    public final String source;

    public Player(String id, String source) {
        this.id = id;
        this.source = source;
    }
}
