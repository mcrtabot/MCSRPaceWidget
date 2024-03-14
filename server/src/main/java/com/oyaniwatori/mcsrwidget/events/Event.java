package com.oyaniwatori.mcsrwidget.events;

public class Event {
    public final String id;
    public final String type;
    public final Long rta;
    public final Long igt;

    public Event(String eventId, String type, long rta, long igt) {
        this.id = eventId;
        this.type = type;
        this.rta = rta;
        this.igt = igt;
    }

    public static Event parse(String eventString) {
        try {
            String[] parts = eventString.trim().split(" ");

            int index = 0;
            String eventId = parts[index++];
            String type = eventId.split("\\.")[1];
            long rta = Long.parseLong(parts[index++]);
            long igt = Long.parseLong(parts[index++]);

            return new Event(eventId, type, rta, igt);
        } catch (Exception e) {
            return null;
        }
    }
}