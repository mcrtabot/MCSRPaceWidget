package com.oyaniwatori.mcsrwidget;

import java.io.IOException;

import com.oyaniwatori.mcsrwidget.events.EventList;
import com.oyaniwatori.mcsrwidget.gui.AppFrame;

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
                    return newFixedLengthResponse(Response.Status.OK, "application/json", "[]");
                }
            }
        } else if (uri.startsWith("/setting/") || uri.startsWith("/theme/")) {
            return this.responseFromStaticFile("", uri);
        } else {
            if (uri.equals("/")) {
                uri += "index.html";
            }

            return this.responseFromStaticFile("/public", uri);
        }

        return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
    }

    private Response responseFromStaticFile(String dir, String path) {
        return newChunkedResponse(Response.Status.OK, getMimeTypeForFile(path),
                getClass().getResourceAsStream(dir + path));
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