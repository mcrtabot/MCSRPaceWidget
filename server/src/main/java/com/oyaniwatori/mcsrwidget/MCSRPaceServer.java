package com.oyaniwatori.mcsrwidget;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.gui.AppFrame;
import com.oyaniwatori.mcsrwidget.utils.Uploads;
import com.oyaniwatori.mcsrwidget.utils.Utils;

import fi.iki.elonen.NanoHTTPD;
import com.formdev.flatlaf.themes.FlatMacLightLaf;

public class MCSRPaceServer extends NanoHTTPD {

    // Constructor
    public MCSRPaceServer(int port) {
        super(port);
    }

    @Override
    public Response serve(IHTTPSession session) {
        try {
            String uri = session.getUri();

            if (uri.startsWith("/api/")) {
                if (uri.equals("/api/timeline")) {
                    try {
                        // EventList events = EventList.load();
                        EventList events = EventList.loadFromTimerIGT();
                        return newFixedLengthResponse(Response.Status.OK, "application/json", events.toJson());
                    } catch (Exception e) {
                        System.out.println("load events failed.");
                        e.printStackTrace();
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load events failed.\"}");
                    }
                } else if (uri.equals("/api/environment")) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        return newFixedLengthResponse(Response.Status.OK, "application/json",
                                mapper.writeValueAsString(Utils.getEnvironment()));
                    } catch (JsonProcessingException e) {
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load environment failed.\"}");
                    }

                } else if (uri.equals("/api/uploads")) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        return newFixedLengthResponse(Response.Status.OK, "application/json",
                                mapper.writeValueAsString(Arrays.asList(Uploads.list())));
                    } catch (JsonProcessingException e) {
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load uploads failed.\"}");
                    }

                } else if (uri.equals("/api/upload")) {
                    return this.handleUpload(session);

                } else if (uri.equals("/api/player")) {
                    Player player = Utils.getPlayer();

                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        return newFixedLengthResponse(Response.Status.OK, "application/json",
                                player == null ? "{}" : mapper.writeValueAsString(player));
                    } catch (JsonProcessingException e) {
                        System.out.println("load player failed.");
                        e.printStackTrace();
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load player failed.\"}");
                    }

                } else if (uri.equals("/api/icons")) {
                    IconSet[] iconSets = Utils.getIconSets();

                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        return newFixedLengthResponse(Response.Status.OK, "application/json",
                                mapper.writeValueAsString(Arrays.asList(iconSets)));
                    } catch (JsonProcessingException e) {
                        System.out.println("load icon sets failed.");
                        e.printStackTrace();
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load icon sets failed.\"}");
                    }

                } else if (uri.equals("/api/themes")) {
                    Theme[] themes = Utils.getThemes();

                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        return newFixedLengthResponse(Response.Status.OK, "application/json",
                                mapper.writeValueAsString(Arrays.asList(themes)));
                    } catch (JsonProcessingException e) {
                        System.out.println("load themes failed.");
                        e.printStackTrace();
                        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                                "{\"error\": \"load themes failed.\"}");
                    }

                }
            } else if (uri.startsWith("/setting/")) {
                return this.responseFromStaticFile("/setting", uri.substring("/setting".length()));
            } else if (uri.startsWith("/theme/")) {
                return this.responseFromStaticFile("/theme", uri.substring("/theme".length()));
            } else if (uri.startsWith("/upload/")) {
                return this.responseFromStaticFile("/upload", uri.substring("/upload".length()));
            } else if (uri.startsWith("/icon/")) {
                return this.responseFromStaticFile("/icon", uri.substring("/icon".length()));
            } else {
                if (uri.startsWith("/timeline") || uri.startsWith("/indicator") || uri.startsWith("/segment") || uri.startsWith("/playground")
                        || uri.startsWith("/customize")) {
                    uri = "/";
                }
                if (uri.equals("/")) {
                    uri += "index.html";
                }

                return this.responseFromStaticFile("/public", uri);
            }

            return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
        } catch (Exception e) {
            e.printStackTrace();
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "");
        }
    }

    /**
     * 画像の受け取り。
     *
     * バインド先は変えずに、書き込みだけループバックからに限定する。
     * 配信PCとOBSを別マシンにしている構成では読み取りにLAN越しのアクセスが要るため、
     * サーバー全体を閉じるわけにはいかない。
     */
    private Response handleUpload(IHTTPSession session) {
        if (session.getMethod() != Method.POST) {
            return newFixedLengthResponse(Response.Status.METHOD_NOT_ALLOWED, MIME_PLAINTEXT, "POST only");
        }
        // NanoHTTPD はループバックからのアクセスを 127.0.0.1 に正規化する
        if (!"127.0.0.1".equals(session.getRemoteIpAddress())) {
            System.out.println("rejected an upload from " + session.getRemoteIpAddress());
            return newFixedLengthResponse(Response.Status.FORBIDDEN, MIME_PLAINTEXT, "Forbidden");
        }

        try {
            Map<String, String> files = new HashMap<String, String>();
            session.parseBody(files);

            String tempPath = files.get("file");
            if (tempPath == null) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, "application/json",
                        "{\"error\": \"no file\"}");
            }

            String saved = Uploads.save(new File(tempPath), session.getParms().get("file"));
            ObjectMapper mapper = new ObjectMapper();
            return newFixedLengthResponse(Response.Status.OK, "application/json",
                    mapper.writeValueAsString(Collections.singletonMap("name", saved)));
        } catch (Exception e) {
            System.out.println("upload failed: " + e.getMessage());
            return newFixedLengthResponse(Response.Status.BAD_REQUEST, "application/json",
                    "{\"error\": \"upload failed\"}");
        }
    }

    private Response responseFromStaticFile(String dir, String path) {
        File homeResourceDir = Utils.getHomeResourceDir(dir);
        if (homeResourceDir.exists()) {
            File file = new File(homeResourceDir, path);

            if (file.exists()) {
                // ファイルをストリームにして返す
                // Return the file as a stream
                try {
                    return newChunkedResponse(Response.Status.OK, getMimeTypeForFile(path),
                            new FileInputStream(file.getAbsolutePath()));
                } catch (IOException ioe) {
                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "");
                }
            }
        }
        InputStream is = getClass().getResourceAsStream(dir + path);
        if (is == null) {
            return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
        }
        return newChunkedResponse(Response.Status.OK, getMimeTypeForFile(path),
                getClass().getResourceAsStream(dir + path));

    }

    // for jingle plugin
    public static String start4Jingle() {
        final int PORT = 1161;
        try {
            MCSRPaceServer server = new MCSRPaceServer(PORT);
            server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
            return "Server started on port " + PORT;
        } catch (IOException ioe) {
            return "Couldn't start server:\n" + ioe;
        }
    }

    public static void main(String[] args) {
        int port = 1161;
        FlatMacLightLaf.setup();
        try {
            MCSRPaceServer server = new MCSRPaceServer(port);
            server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
            System.out.println("Server started on port " + port);
            new AppFrame().setVisible(true);
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }
}