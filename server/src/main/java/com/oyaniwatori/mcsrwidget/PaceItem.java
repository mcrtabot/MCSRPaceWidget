package com.oyaniwatori.mcsrwidget;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PaceItem {
    @JsonProperty("type")
    private String type;

    @JsonProperty("igt")
    private String igt;

    public PaceItem(){}

    PaceItem(String type, String igt){
        setType(type);
        setIgt(igt);
    }

    // Getter and Setter
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIgt() {
        return igt;
    }

    public void setIgt(String igt) {
        this.igt = igt;
    }

    @Override
    public String toString() {
        return "{" +
                "type='" + type + '\'' +
                ", igt='" + igt + '\'' +
                '}';
    }
}
