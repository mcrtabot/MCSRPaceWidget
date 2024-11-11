package com.oyaniwatori.mcsrwidget.gui;

import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.EmptyBorder;

public class SettingsGUI extends JFrame {
    private static SettingsGUI instance = null;
    private static final long serialVersionUID = 1L;
	private final JPanel formPanel = new JPanel();
	private JTextField enterNetherFileld;
	private JTextField enterBastionField;
	private JTextField enterFortlessField;
	private JTextField firstPortalField;
	private JTextField enterStrongholdField;
	private JTextField enterEndField;
	private JLabel enterBastionLabel;
	private JLabel enterFortlessLabel;
	private JLabel firstPortalLabel;
	private JLabel enterStrongholdLabel;
	private JLabel enterEndLabel;
	private JLabel creditLabel;
	private JTextField creditField;

    public SettingsGUI() {
        setTitle("Pace Settings");
		this.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                SettingsGUI.onClose();
            }
        });
		this.setResizable(false);
		setBounds(100, 100, 270, 270);
		getContentPane().setLayout(new BorderLayout());
		formPanel.setBorder(new EmptyBorder(15, 15, 15, 15));
		getContentPane().add(formPanel, BorderLayout.CENTER);
		GridBagLayout gblFormPanel = new GridBagLayout();
		gblFormPanel.columnWidths = new int[] {96, 64};
		gblFormPanel.rowHeights = new int[] {24, 24, 24, 24, 24, 24, 24};
		gblFormPanel.columnWeights = new double[]{0.0, 1.0};
		gblFormPanel.rowWeights = new double[]{0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};
		formPanel.setLayout(gblFormPanel);
		{
			JLabel enterNetherLabel = new JLabel("Enter Nether");
			GridBagConstraints gbc_enterNetherLabel = new GridBagConstraints();
			gbc_enterNetherLabel.insets = new Insets(0, 0, 5, 5);
			gbc_enterNetherLabel.anchor = GridBagConstraints.EAST;
			gbc_enterNetherLabel.gridx = 0;
			gbc_enterNetherLabel.gridy = 0;
			formPanel.add(enterNetherLabel, gbc_enterNetherLabel);
		}
		{
			enterNetherFileld = new JTextField();
			GridBagConstraints gbc_enterNetherFileld = new GridBagConstraints();
			gbc_enterNetherFileld.insets = new Insets(0, 0, 5, 0);
			gbc_enterNetherFileld.fill = GridBagConstraints.HORIZONTAL;
			gbc_enterNetherFileld.gridx = 1;
			gbc_enterNetherFileld.gridy = 0;
			formPanel.add(enterNetherFileld, gbc_enterNetherFileld);
			enterNetherFileld.setColumns(10);
		}
		{
			enterBastionLabel = new JLabel("Enter Bastion");
			GridBagConstraints gbc_enterBastionLabel = new GridBagConstraints();
			gbc_enterBastionLabel.insets = new Insets(0, 0, 5, 5);
			gbc_enterBastionLabel.anchor = GridBagConstraints.EAST;
			gbc_enterBastionLabel.gridx = 0;
			gbc_enterBastionLabel.gridy = 1;
			formPanel.add(enterBastionLabel, gbc_enterBastionLabel);
		}
		{
			enterBastionField = new JTextField();
			GridBagConstraints gbc_enterBastionField = new GridBagConstraints();
			gbc_enterBastionField.insets = new Insets(0, 0, 5, 0);
			gbc_enterBastionField.fill = GridBagConstraints.HORIZONTAL;
			gbc_enterBastionField.gridx = 1;
			gbc_enterBastionField.gridy = 1;
			formPanel.add(enterBastionField, gbc_enterBastionField);
			enterBastionField.setColumns(10);
		}
		{
			enterFortlessLabel = new JLabel("Enter Fortless");
			GridBagConstraints gbc_enterFortlessLabel = new GridBagConstraints();
			gbc_enterFortlessLabel.insets = new Insets(0, 0, 5, 5);
			gbc_enterFortlessLabel.anchor = GridBagConstraints.EAST;
			gbc_enterFortlessLabel.gridx = 0;
			gbc_enterFortlessLabel.gridy = 2;
			formPanel.add(enterFortlessLabel, gbc_enterFortlessLabel);
		}
		{
			enterFortlessField = new JTextField();
			GridBagConstraints gbc_enterFortlessField = new GridBagConstraints();
			gbc_enterFortlessField.insets = new Insets(0, 0, 5, 0);
			gbc_enterFortlessField.fill = GridBagConstraints.HORIZONTAL;
			gbc_enterFortlessField.gridx = 1;
			gbc_enterFortlessField.gridy = 2;
			formPanel.add(enterFortlessField, gbc_enterFortlessField);
			enterFortlessField.setColumns(10);
		}
		{
			firstPortalLabel = new JLabel("First Portal");
			GridBagConstraints gbc_firstPortalLabel = new GridBagConstraints();
			gbc_firstPortalLabel.insets = new Insets(0, 0, 5, 5);
			gbc_firstPortalLabel.anchor = GridBagConstraints.EAST;
			gbc_firstPortalLabel.gridx = 0;
			gbc_firstPortalLabel.gridy = 3;
			formPanel.add(firstPortalLabel, gbc_firstPortalLabel);
		}
		{
			firstPortalField = new JTextField();
			GridBagConstraints gbc_firstPortalField = new GridBagConstraints();
			gbc_firstPortalField.insets = new Insets(0, 0, 5, 0);
			gbc_firstPortalField.fill = GridBagConstraints.HORIZONTAL;
			gbc_firstPortalField.gridx = 1;
			gbc_firstPortalField.gridy = 3;
			formPanel.add(firstPortalField, gbc_firstPortalField);
			firstPortalField.setColumns(10);
		}
		{
			enterStrongholdLabel = new JLabel("Enter Stronghold");
			GridBagConstraints gbc_enterStrongholdLabel = new GridBagConstraints();
			gbc_enterStrongholdLabel.insets = new Insets(0, 0, 5, 5);
			gbc_enterStrongholdLabel.anchor = GridBagConstraints.EAST;
			gbc_enterStrongholdLabel.gridx = 0;
			gbc_enterStrongholdLabel.gridy = 4;
			formPanel.add(enterStrongholdLabel, gbc_enterStrongholdLabel);
		}
		{
			enterStrongholdField = new JTextField();
			GridBagConstraints gbc_enterStrongholdField = new GridBagConstraints();
			gbc_enterStrongholdField.insets = new Insets(0, 0, 5, 0);
			gbc_enterStrongholdField.fill = GridBagConstraints.HORIZONTAL;
			gbc_enterStrongholdField.gridx = 1;
			gbc_enterStrongholdField.gridy = 4;
			formPanel.add(enterStrongholdField, gbc_enterStrongholdField);
			enterStrongholdField.setColumns(10);
		}
		{
			enterEndLabel = new JLabel("Enter End");
			GridBagConstraints gbc_enterEndLabel = new GridBagConstraints();
			gbc_enterEndLabel.insets = new Insets(0, 0, 5, 5);
			gbc_enterEndLabel.anchor = GridBagConstraints.EAST;
			gbc_enterEndLabel.gridx = 0;
			gbc_enterEndLabel.gridy = 5;
			formPanel.add(enterEndLabel, gbc_enterEndLabel);
		}
		{
			enterEndField = new JTextField();
			GridBagConstraints gbc_enterEndField = new GridBagConstraints();
			gbc_enterEndField.insets = new Insets(0, 0, 5, 0);
			gbc_enterEndField.fill = GridBagConstraints.HORIZONTAL;
			gbc_enterEndField.gridx = 1;
			gbc_enterEndField.gridy = 5;
			formPanel.add(enterEndField, gbc_enterEndField);
			enterEndField.setColumns(10);
		}
		{
			creditLabel = new JLabel("GG");
			GridBagConstraints gbc_creditLabel = new GridBagConstraints();
			gbc_creditLabel.anchor = GridBagConstraints.EAST;
			gbc_creditLabel.insets = new Insets(0, 0, 0, 5);
			gbc_creditLabel.gridx = 0;
			gbc_creditLabel.gridy = 6;
			formPanel.add(creditLabel, gbc_creditLabel);
		}
		{
			creditField = new JTextField();
			GridBagConstraints gbc_creditField = new GridBagConstraints();
			gbc_creditField.fill = GridBagConstraints.HORIZONTAL;
			gbc_creditField.gridx = 1;
			gbc_creditField.gridy = 6;
			formPanel.add(creditField, gbc_creditField);
			creditField.setColumns(10);
		}
		{
			JPanel buttonPane = new JPanel();
			buttonPane.setLayout(new FlowLayout(FlowLayout.RIGHT));
			getContentPane().add(buttonPane, BorderLayout.SOUTH);
			{
				JButton okButton = new JButton("Save");
				okButton.addActionListener(new ActionListener() {
					@Override
					public void actionPerformed(ActionEvent e) {
						// save process
					}
				});
				buttonPane.add(okButton);
				getRootPane().setDefaultButton(okButton);
			}
			{
				JButton cancelButton = new JButton("Cancel");
				cancelButton.addActionListener(new ActionListener() {
					@Override
					public void actionPerformed(ActionEvent e) {
						SettingsGUI.close();
					}
				});
				cancelButton.setActionCommand("Cancel");
				buttonPane.add(cancelButton);
			}
		}
	}

    public static SettingsGUI open() {
        if (instance == null) {
            instance = new SettingsGUI();
			instance.setVisible(true);
        } else {
			instance.requestFocus();
		}
        return instance;
    }

	private static void close() {
		onClose();
	}

	public static void onClose() {
		instance.setVisible(false);
		instance = null;
	}
}
