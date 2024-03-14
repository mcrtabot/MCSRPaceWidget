package com.oyaniwatori.mcsrwidget.events;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EventList {
    public List<Event> items;

    public EventList(List<Event> items) {
        this.items = items;
    }

    public static EventList parse(String eventsString) {
        List<Event> items = new ArrayList<>();

        for (String line : eventsString.split("\r\n|\r|\n")) {
            Event event = Event.parse(line);
            if (event != null) {
                items.add(event);
            }
        }
        return new EventList(items);
    }

    public static EventList load() throws IOException {
        String separator = File.separator;
        String latestWorldFilePath = System.getProperty("user.home") + separator + "speedrunigt" + separator
                + "latest_world.json";

        ObjectMapper mapper = new ObjectMapper();
        JsonNode latestWorldData = mapper.readTree(Paths.get(latestWorldFilePath).toFile());

        String instancePath = latestWorldData.get("world_path").textValue();
        String eventLogFilePath = instancePath + separator + "speedrunigt" + separator + "events.log";

        String eventsString = Files.readString(Paths.get(eventLogFilePath));

        return EventList.parse(eventsString);
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(this.items);
    }
}
