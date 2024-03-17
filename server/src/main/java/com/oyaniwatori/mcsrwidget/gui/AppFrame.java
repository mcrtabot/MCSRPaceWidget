package com.oyaniwatori.mcsrwidget.gui;

import java.awt.BorderLayout;
import java.awt.Container;
import java.net.URL;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

import java.awt.Desktop;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URI;

public class AppFrame extends JFrame {
    JComboBox<String> themeCombo;

    public AppFrame() {
        super("MCSR Pace Widget Server");

        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(272, 124);

        Container contentPane = getContentPane();
        contentPane.setLayout(null);

        JPanel p = new JPanel();
        p.setLayout(null);
        p.setBounds(16, 18, 240, 60);
        contentPane.add(p, BorderLayout.CENTER);

        {
            JButton openButton = new JButton("open MCSR Pace Widget");
            openButton.setBounds(0, 0, 240, 60);
            openButton.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    String url = "http://127.0.0.1:1161/";
                    try {
                        openWebpage(new URL(url).toURI());
                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(null, "can not open: " + url);
                    }
                }
            });
            p.add(openButton, BorderLayout.CENTER);
        }
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
