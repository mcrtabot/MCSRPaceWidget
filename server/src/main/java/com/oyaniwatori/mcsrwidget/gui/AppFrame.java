package com.oyaniwatori.mcsrwidget.gui;

import java.io.File;
import java.net.URL;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

import java.awt.Desktop;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URI;

import com.oyaniwatori.mcsrwidget.utils.Utils;

public class AppFrame extends JFrame {
    JComboBox<String> themeCombo;
    private JPanel contentPane;

    public AppFrame() {
        super("MCSR Pace Widget Server");

        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 312, 197);
		contentPane = new JPanel();
		// contentPane.setBackground(new Color(240, 240, 240));
		contentPane.setBorder(new EmptyBorder(10, 10, 10, 10));

		setContentPane(contentPane);
		GridBagLayout gblContentPane = new GridBagLayout();
		gblContentPane.columnWidths = new int[] {255};
		gblContentPane.rowHeights = new int[] {32, 32, 32, 32};
		gblContentPane.columnWeights = new double[]{0.0};
		gblContentPane.rowWeights = new double[]{0.0, 0.0, 0.0, 0.0};
		contentPane.setLayout(gblContentPane);
		
		JButton openButton = new JButton("Open MCSR Pace Widget");
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
		GridBagConstraints gbcOpenButton = new GridBagConstraints();
		gbcOpenButton.gridheight = 2;
		gbcOpenButton.fill = GridBagConstraints.BOTH;
		gbcOpenButton.insets = new Insets(0, 0, 5, 0);
		gbcOpenButton.gridx = 0;
		gbcOpenButton.gridy = 0;
		contentPane.add(openButton, gbcOpenButton);
		
		JButton settingsButton = new JButton("Pace Settings...");
        settingsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                SettingsGUI.open();
            }
        });
		GridBagConstraints gbcSettingsButton = new GridBagConstraints();
		gbcSettingsButton.fill = GridBagConstraints.BOTH;
		gbcSettingsButton.insets = new Insets(0, 0, 5, 0);
		gbcSettingsButton.gridx = 0;
		gbcSettingsButton.gridy = 2;
		contentPane.add(settingsButton, gbcSettingsButton);

		JButton configFolderButton = new JButton("Open Config Folder");
        configFolderButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                openConfigFolder();
            }
        });
		GridBagConstraints gbcConfigFolderButton = new GridBagConstraints();
		gbcConfigFolderButton.fill = GridBagConstraints.BOTH;
		gbcConfigFolderButton.gridx = 0;
		gbcConfigFolderButton.gridy = 3;
		contentPane.add(configFolderButton, gbcConfigFolderButton);
    }

    /** ホームのコンフィグフォルダを Finder / エクスプローラーで開く */
    public static void openConfigFolder() {
        // 起動時に作れていなかった場合はここで作り直す
        Utils.prepareHomeResourceDir();

        File dir = Utils.getHomeResourceDir(null);
        if (dir.isDirectory()) {
            Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
            if (desktop != null && desktop.isSupported(Desktop.Action.OPEN)) {
                try {
                    desktop.open(dir);
                    return;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        JOptionPane.showMessageDialog(null, "can not open: " + dir);
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
