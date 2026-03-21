package com.oyaniwatori.mcsrwidget;

public class Theme {
    public final String name;
    public final boolean timeline;
    public final boolean indicator;
    public final boolean segment;

    public Theme(String name, boolean timeline, boolean indicator, boolean segment) {
        this.name = name;
        this.timeline = timeline;
        this.indicator = indicator;
        this.segment = segment;
    }
}
