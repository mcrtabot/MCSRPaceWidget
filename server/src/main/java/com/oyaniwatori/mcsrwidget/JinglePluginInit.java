package com.oyaniwatori.mcsrwidget;

import java.io.IOException;
import java.nio.charset.Charset;

import org.apache.logging.log4j.Level;
import xyz.duncanruns.jingle.gui.JingleGUI;
import xyz.duncanruns.jingle.plugin.PluginManager;
import xyz.duncanruns.jingle.Jingle;
import xyz.duncanruns.jingle.JingleAppLaunch;

import com.google.common.io.Resources;
import com.oyaniwatori.mcsrwidget.gui.PluginGUI;

// プラグイン読み込み用クラス
public class JinglePluginInit {
    public static void main(String[] args) throws IOException {
        // デバッグ用
        // 実行するとJingleがpluginを読み込んだ状態で開く
        JingleAppLaunch.launchWithDevPlugin(args, PluginManager.JinglePluginData.fromString(
                Resources.toString(Resources.getResource(JinglePluginInit.class, "/jingle.plugin.json"), Charset.defaultCharset())
        ), JinglePluginInit::initialize);
    }

    public static void initialize() {
        // プラグイン読み込み用
        JingleGUI.addPluginTab("MCSR Pace Widget", new PluginGUI().mainPanel);
        final String RESPONCE = MCSRPaceServer.start4Jingle();
        Jingle.log(Level.INFO, "(MCSR Pace Widget) " + RESPONCE);
    }
}