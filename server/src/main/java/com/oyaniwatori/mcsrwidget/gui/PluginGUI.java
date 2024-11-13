package com.oyaniwatori.mcsrwidget.gui;

import java.net.URL;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JComponent;

// The basic part of the code refers to 
// https://github.com/DuncanRuns/Jingle-Example-Plugin/blob/main/src/main/java/xyz/duncanruns/jingle/exampleplugin/gui/ExamplePluginPanel.java
public class PluginGUI {
    public JPanel contentPane;

    {
        $$$setupUI$$$();
    }

    private void $$$setupUI$$$() {
        contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(10, 10, 10, 10));

		GridBagLayout gblContentPane = new GridBagLayout();
		gblContentPane.columnWidths = new int[] {255};
		gblContentPane.rowHeights = new int[] {32, 32, 32};
		gblContentPane.columnWeights = new double[]{0.0};
		gblContentPane.rowWeights = new double[]{0.0, 0.0, 0.0};
		contentPane.setLayout(gblContentPane);
		
		JButton openButton = new JButton("Open MCSR Pace Widget");
        openButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String url = "http://127.0.0.1:1161/";
                try {
                    AppFrame.openWebpage(new URL(url).toURI());
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
		gbcSettingsButton.gridx = 0;
		gbcSettingsButton.gridy = 2;
		contentPane.add(settingsButton, gbcSettingsButton);
    }

    public JComponent $$$getRootComponent$$$() {
        return contentPane;
    }

}