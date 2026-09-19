package com.oyaniwatori.mcsrwidget;

/**
 * ウィジェットが動く前提が揃っているかの状態。
 * 揃っていないと「起動したのに何も出ない」になるため、画面から確認できるようにする。
 */
public class Environment {
    /** 直近に遊んだワールドのパス。SpeedRunIGT が書く latest_world.json から取る */
    public final String worldPath;

    /** SpeedRunIGT の Auto Save Interval。TICKS / PAUSE / NONE。読めなければ null */
    public final String autoSaveInterval;

    /** 実際に読んだ options.txt の場所。読めなければ探した場所 */
    public final String optionsPath;

    public Environment(String worldPath, String autoSaveInterval, String optionsPath) {
        this.worldPath = worldPath;
        this.autoSaveInterval = autoSaveInterval;
        this.optionsPath = optionsPath;
    }

    /** 実時間で更新されるのは Ticks のときだけ */
    public boolean isAutoSaveIntervalOk() {
        return "TICKS".equals(this.autoSaveInterval);
    }
}
