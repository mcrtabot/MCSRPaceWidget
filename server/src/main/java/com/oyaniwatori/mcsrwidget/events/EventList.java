package com.oyaniwatori.mcsrwidget.events;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.crypt.Crypto;

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

    public static EventList loadFromTimerIGT() throws IOException {
        String separator = File.separator;
        String latestWorldFilePath = System.getProperty("user.home") + separator + "speedrunigt" + separator
                + "latest_world.json";
        ObjectMapper mapper = new ObjectMapper();
        JsonNode latestWorldData = mapper.readTree(Paths.get(latestWorldFilePath).toFile());

        String instancePath = latestWorldData.get("world_path").textValue();
        JsonNode json;
        try {
            String path = instancePath + separator + "speedrunigt" + separator + "data" + separator + "timer.igt";
            json = mapper.readTree(Crypto.decrypt(FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8)));
        } catch (Exception e) {
            String path = instancePath + separator + "speedrunigt" + separator + "data" + separator + "timer.igt.old";
            json = mapper.readTree(Crypto.decrypt(FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8)));
        }

        List<Event> items = new ArrayList<Event>();
        if (json.get("status").asText().equals("LEAVE")) {
            return new EventList(new ArrayList<Event>(items));
        }

        for (JsonNode item : json.get("timelines")) {
            String name = item.get("name").asText();
            int rta = item.get("rta").asInt();
            int igt = item.get("igt").asInt();

            String type;
            if (name.startsWith("enter_")) {
                type = name;
            } else if (name.equals("portal_no_1")) {
                type = "first_portal";
            } else if (name.equals("portal_no_2")) {
                type = "second_portal";
            } else {
                type = name;
            }
            String id = "rsg." + type;
            items.add(new Event(id, type, rta, igt));
        }
        if (json.get("isCompleted").asBoolean(false)) {
            JsonNode record = mapper.readTree(json.get("resultRecord").asText());
            System.out.println(record);
            int rta = record.get("final_rta").asInt();
            int igt = record.get("final_igt").asInt();

            String type = "credits";
            String id = "rsg." + type;

            items.add(new Event(id, type, rta, igt));
        }

        return new EventList(new ArrayList<Event>(items));
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(this.items);
    }
}
