package com.oyaniwatori.mcsrwidget;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.utils.Crypto;
import com.oyaniwatori.mcsrwidget.utils.Utils;

public class EventList {
    public List<Event> timelines;
    public Long igt = null;

    public EventList(List<Event> timelines, Long igt) {
        this.timelines = timelines;
        this.igt = igt;
    }

    public static EventList parse(String eventsString) {
        List<Event> items = new ArrayList<>();

        for (String line : eventsString.split("\r\n|\r|\n")) {
            Event event = Event.parse(line);
            if (event != null) {
                items.add(event);
            }
        }
        return new EventList(items, null);
    }

    public static EventList load() throws IOException {
        String separator = File.separator;
        String instancePath = Utils.getInstancePath();
        String eventLogFilePath = instancePath + separator + "speedrunigt" + separator + "events.log";

        String eventsString = Files.readString(Paths.get(eventLogFilePath));

        return EventList.parse(eventsString);
    }

    public static EventList loadFromTimerIGT() throws IOException {
        String separator = File.separator;
        ObjectMapper mapper = new ObjectMapper();

        String instancePath = Utils.getInstancePath();
        JsonNode json;
        try {
            String path = instancePath + separator + "speedrunigt" + separator + "data" + separator + "timer.igt";
            json = mapper.readTree(Crypto.decrypt(FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8)));
        } catch (Exception e) {
            String path = instancePath + separator + "speedrunigt" + separator + "data" + separator + "timer.igt.old";
            json = mapper.readTree(Crypto.decrypt(FileUtils.readFileToString(new File(path), StandardCharsets.UTF_8)));
        }

        List<Event> items = new ArrayList<Event>();
        if (json.get("leaveTime").asLong() > 0) {
            return new EventList(items, null);
        }

        long activateTicks = json.get("activateTicks").asLong();
        long rebaseIGTime = json.get("rebaseIGTime").asLong();
        long excludedIGT = json.get("excludedIGT").asLong();
        long endIGTTime = json.get("endIGTTime").asLong();
        long currentIgt = activateTicks * 50 - rebaseIGTime - excludedIGT + endIGTTime;

        // クリア判定をするかどうかのために、エンドインしているかを保持しておく
        boolean isEnteredEnd = false;
        for (JsonNode item : json.get("timelines")) {
            String name = item.get("name").asText();
            long rta = item.get("rta").asLong();
            long igt = item.get("igt").asLong();

            String type;
            if (name.startsWith("enter_")) {
                type = name;
            } else if (name.equals("nether_travel")) {
                type = "first_portal";
            } else {
                type = name;
            }
            String id = "rsg." + type;
            items.add(new Event(id, type, rta, igt));

            // エンドインしてる場合、isEnteredEndをtrueにしておく
            if (type.equals("enter_end")) {
                isEnteredEnd = true;
            }
        }
        if (json.get("isCompleted").asBoolean(false)) {
            JsonNode record = mapper.readTree(json.get("resultRecord").asText());
            long rta = record.get("final_rta").asLong();
            long igt = record.get("final_igt").asLong();

            String type = "credits";
            String id = "rsg." + type;

            items.add(new Event(id, type, rta, igt));
        } else if (isEnteredEnd) {
            // event.log からイベントリストを取得
            try {
                EventList eventList = EventList.load();
                Event creditEvent = eventList.getEvent("credits");

                if (creditEvent != null) {
                    // ここに来るのはエンドロール表示中のみ
                    long rta = creditEvent.rta;
                    long igt = currentIgt;

                    String type = "credits";
                    String id = "rsg." + type;

                    items.add(new Event(id, type, rta, igt));
                }
            } catch (IOException e) {
                // event.log が読み込めない場合はクリティカルではないため、何もしない
                System.err.println("Failed to load event.log");
            }
        }

        if (json.get("lanOpenedTime").asLong() > 0) {
            long rta = json.get("lanOpenedTime").asLong();
            long igt = 0;

            String type = "enable_cheats";
            String id = "common." + type;

            items.add(new Event(id, type, rta, igt));
        }

        items.sort(
                new Comparator<Event>() {

                    @Override
                    public int compare(Event o1, Event o2) {
                        return o1.rta.compareTo(o2.rta);
                    }

                });

        return new EventList(items, currentIgt);
    }

    private Event getEvent(String type) {
        // timer.igt ではエンドロールに入っているか判別できないため、event.log に credits があるかどうかを確認する
        for (Event event : this.timelines) {
            if (event.type.equals(type)) {
                return event;
            }
        }
        return null;
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(this);
    }
}
