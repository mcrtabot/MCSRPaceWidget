package com.oyaniwatori.mcsrwidget;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oyaniwatori.mcsrwidget.gui.AppFrame;
import com.oyaniwatori.mcsrwidget.utils.Utils;

import fi.iki.elonen.NanoHTTPD;

public class MCSRPaceServer extends NanoHTTPD {

    // Constructor
    public MCSRPaceServer(int port) {
        super(port);
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();

        if (uri.startsWith("/api/")) {
            if (uri.equals("/api/timeline")) {
                try {
                    // EventList events = EventList.load();
                    EventList events = EventList.loadFromTimerIGT();
                    return newFixedLengthResponse(Response.Status.OK, "application/json", events.toJson());
                } catch (Exception e) {
                    System.out.println("load events failed.");
                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                            "{\"error\": \"load events failed.\"}");
                }
            } else if (uri.equals("/api/themes")) {
                Theme[] themes = Utils.getThemes();

                try {
                    ObjectMapper mapper = new ObjectMapper();
                    return newFixedLengthResponse(Response.Status.OK, "application/json",
                            mapper.writeValueAsString(Arrays.asList(themes)));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "application/json",
                            "{\"error\": \"load themes failed.\"}");
                }

            }
        } else if (uri.startsWith("/setting/")) {
            return this.responseFromStaticFile("/setting", uri.substring("/setting".length()));
        } else if (uri.startsWith("/theme/")) {
            return this.responseFromStaticFile("/theme", uri.substring("/theme".length()));
        } else {
            if (uri.startsWith("/timeline") || uri.startsWith("/indicator")) {
                uri = "/";
            }
            if (uri.equals("/")) {
                uri += "index.html";
            }

            return this.responseFromStaticFile("/public", uri);
        }

        return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
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