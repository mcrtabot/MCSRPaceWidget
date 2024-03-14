package com.oyaniwatori.mcsrwidget.gui;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Cursor;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.swing.DefaultComboBoxModel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.event.MouseInputAdapter;

import java.awt.Desktop;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.io.File;
import java.net.URI;

public class AppFrame extends JFrame {
    JComboBox<String> themeCombo;

    public AppFrame() {
        super("MCSR Pace Widget Server");

        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(340, 136);

        Container contentPane = getContentPane();
        contentPane.setLayout(null);

        JPanel p = new JPanel();
        p.setLayout(null);
        p.setBounds(32, 20, 308, 104);
        contentPane.add(p, BorderLayout.CENTER);

        {
            String[] themes = getThemes();
            themeCombo = new JComboBox<String>(themes);
            themeCombo.setBounds(0, 0, 200, 40);
            if (Arrays.asList(themes).contains("default")) {
                themeCombo.setSelectedItem("default");
            }
            p.add(themeCombo, BorderLayout.CENTER);
        }

        {
            JButton openButton = new JButton("open");
            openButton.setBounds(208, 0, 80, 40);
            openButton.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    List<String> params = new ArrayList<String>();
                    if (!themeCombo.getSelectedItem().equals("default")) {
                        params.add("theme=" + themeCombo.getSelectedItem());
                    }
                    String url = buildURL(params);
                    try {
                        openWebpage(new URL(url).toURI());
                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(null, "can not open: " + url);
                    }
                }
            });
            p.add(openButton, BorderLayout.CENTER);
        }

        {
            JLabel reloadLink = new JLabel("<html><u>reload themes</u></html>");
            reloadLink.setBounds(8, 32, 138, 24);
            reloadLink.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            reloadLink.addMouseListener(new MouseInputAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    String[] themes = getThemes();
                    themeCombo.setModel(new DefaultComboBoxModel<String>(themes));
                }
            });

            p.add(reloadLink, BorderLayout.WEST);
        }

        {
            JLabel demoLink = new JLabel("<html><u>open with demo data</u></html>");
            demoLink.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            demoLink.setBounds(8, 52, 138, 24);
            demoLink.addMouseListener(new MouseInputAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    List<String> params = new ArrayList<String>();
                    if (!themeCombo.getSelectedItem().equals("default")) {
                        params.add("theme=" + themeCombo.getSelectedItem());
                    }
                    params.add("demo=1");
                    String url = buildURL(params);
                    try {
                        openWebpage(new URL(url).toURI());
                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(null, "can not open: " + url);
                    }
                }
            });

            p.add(demoLink, BorderLayout.EAST);
        }

        getThemes();
    }

    private static String[] getThemes() {
        List<String> themes = new ArrayList<String>();
        File[] files = new File("./theme").listFiles();
        if (files == null) {
            return new String[] {};
        }
        for (int i = 0; i < files.length; i++) {
            File file = files[i];
            if (!file.isDirectory()) {
                continue;
            }
            themes.add(file.getName());
        }
        Collections.sort(themes);
        return themes.toArray(new String[themes.size()]);
    }

    public static String buildURL(List<String> params) {
        String url = "http://127.0.0.1:1161";
        if (params.size() > 0) {
            url += "?" + String.join("&", params);
        }
        return url;
    }

    public static boolean openWebpage(URI uri) {
        Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
        if (desktop != null && desktop.isSupported(Desktop.Action.BROWSE)) {
            try {
                desktop.browse(uri);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
