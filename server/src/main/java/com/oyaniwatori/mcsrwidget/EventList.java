package com.oyaniwatori.mcsrwidget;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.utils.Crypto;
import com.oyaniwatori.mcsrwidget.utils.Utils;

public class EventList {
    public List<Event> timelines;
    /** 区間の境目ではない「途中の一点」。詳細は CONTEXT_ADVANCEMENTS を参照 */
    public List<Event> context = new ArrayList<>();
    public Long igt = null;
    public Long retimedIgt = null;
    public Long retimeAmount = null;

    /**
     * context として拾う advancement。値は SpeedRunIGT の events/rsg.json と同じ名前に
     * 揃えてあるので、テーマ側は PaceMan の contextEventList と同じキーで書ける。
     *
     * events.log にも同じイベントが出るが、あちらの igt は getRetimedInGameTime()
     * つまりリタイム込みで、timelines[] の igt (getInGameTime(false)) とは基準が違う。
     * 同じ時間軸に並べたいので、基準の揃っている advancement 側を使う。
     *
     * 区間の境目になるもの(enter_nether / find_bastion / find_fortress /
     * follow_ender_eye / enter_the_end)は timelines[] に出るので、ここには入れない。
     */
    private static final Map<String, String> CONTEXT_ADVANCEMENTS;
    static {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("story/smelt_iron", "obtain_iron_ingot");
        map.put("story/iron_tools", "obtain_iron_pickaxe");
        map.put("story/lava_bucket", "obtain_lava_bucket");
        map.put("nether/distract_piglin", "distract_piglin");
        map.put("nether/loot_bastion", "loot_bastion");
        map.put("story/form_obsidian", "obtain_obsidian");
        map.put("nether/obtain_crying_obsidian", "obtain_crying_obsidian");
        map.put("nether/obtain_blaze_rod", "obtain_blaze_rod");
        CONTEXT_ADVANCEMENTS = Collections.unmodifiableMap(map);
    }

    public EventList(List<Event> timelines, Long igt, Long retimedIgt, Long retimeAmount) {
        this.timelines = timelines;
        this.igt = igt;
        this.retimedIgt = retimedIgt;
        this.retimeAmount = retimeAmount;
    }

    public EventList(List<Event> timelines, Long igt) {
        this(timelines, igt, null, null);
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

        // リタイム対応: IGTが13分以内の場合、retimedIGTTime（ポーズ時間累積）をIGTに加算
        // MCSRルール: 13分以内のランではポーズ時間がIGTに加算される
        long retimeAmount = 0;
        if (currentIgt < 1000 * 60 * 13) {
            JsonNode retimedIGTTimeNode = json.get("retimedIGTTime");
            if (retimedIGTTimeNode != null && !retimedIGTTimeNode.isNull()) {
                retimeAmount = retimedIGTTimeNode.asLong();
            }
        }
        long retimedIgt = currentIgt + retimeAmount;

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
            // 完走後はactivateTicksが進み続けるためcurrentIgtは使えない
            // resultRecordのretimed_igt（またはfinal_igt）を使用する
            // ただし13分以上の場合はリタイム不要なためfinal_igtを使用する
            long finalIgt = record.get("final_igt").asLong();
            long creditsIgt;
            if (finalIgt < 1000 * 60 * 13) {
                JsonNode retimedIgtNode = record.get("retimed_igt");
                creditsIgt = (retimedIgtNode != null && !retimedIgtNode.isNull())
                        ? retimedIgtNode.asLong()
                        : finalIgt;
            } else {
                creditsIgt = finalIgt;
            }

            String type = "credits";
            String id = "rsg." + type;

            items.add(new Event(id, type, rta, creditsIgt));
        } else if (isEnteredEnd) {
            // event.log からイベントリストを取得
            try {
                EventList eventList = EventList.load();
                Event creditEvent = eventList.getEvent("credits");

                if (creditEvent != null) {
                    // ここに来るのはエンドロール表示中のみ
                    long rta = creditEvent.rta;
                    long igt = retimedIgt;

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

        EventList eventList = new EventList(items, currentIgt, retimedIgt, retimeAmount);
        eventList.context = parseContext(json);
        return eventList;
    }

    /**
     * timer.igt の advancementsTracker から context を組み立てる。
     * 取り損ねても本体の表示には影響しないので、形が違えば黙って空で返す。
     */
    private static List<Event> parseContext(JsonNode json) {
        List<Event> context = new ArrayList<>();

        JsonNode advancements = json.path("advancementsTracker").path("advancements");
        if (!advancements.isObject()) {
            return context;
        }

        Iterator<Map.Entry<String, JsonNode>> fields = advancements.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();

            // キーは "minecraft:story/smelt_iron" 形式。名前空間は見ずにパスだけで引く
            String key = entry.getKey();
            String path = key.substring(key.indexOf(':') + 1);
            String type = CONTEXT_ADVANCEMENTS.get(path);
            if (type == null) {
                continue;
            }

            // 条件の一部だけ満たした advancement も入っているので、完了したものだけ拾う
            JsonNode track = entry.getValue();
            if (!track.path("complete").asBoolean(false)) {
                continue;
            }

            context.add(new Event("rsg." + type, type, track.path("rta").asLong(), track.path("igt").asLong()));
        }

        context.sort(
                new Comparator<Event>() {

                    @Override
                    public int compare(Event o1, Event o2) {
                        return o1.igt.compareTo(o2.igt);
                    }

                });

        return context;
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
