# MCSR (Minecraft Speedrunning) Pace Widget

[日本語の README はこちら](README.ja.md)

A pace display widget that enhances your Minecraft speedrun (RSG) streams.
Integrates with SpeedRunIGT to show split times and comparisons against your target pace in real time.
Set your PB, goal times, or any custom pace as the baseline —
works as an OBS browser source, just pick a theme and add it to your scene.

<img src="docs/timeline_texture-bar.gif" alt="Timeline display example">
<img src="docs/indicator_texture-bar.gif" alt="Visual timeline display example">

## Features

- **Timeline** — Table display showing current pace and difference from personal best (PB)
- **Visual Timeline** — Bar-style visual progress indicator
- Customizable themes (7 built-in + custom theme support)
- Real-time updates via SpeedRunIGT integration

## Requirements

- SpeedRunIGT 14.0 or later
  - **Set "Auto Save Interval" (SpeedRunIGT Options > Timer) to `Ticks`** — required for real-time split updates

## Installation

Download the zip from the [Release Page](https://github.com/mcrtabot/MCSRPaceWidget/releases) and extract it.

### Standalone

1. Run `mcsr-pace-widget.jar`
2. Click `open MCSR Pace Widget` (opens http://127.0.0.1:1161)
3. Select a theme and copy the widget URL
4. Set the URL as an OBS browser source

### As a Jingle Plugin

1. Create a `.config/MCSRPaceWidget` directory in your home directory and copy `theme` and `setting` from the extracted files
   - Windows: `C:\Users\<username>\.config\MCSRPaceWidget`
2. Copy `mcsr-pace-widget.jar` to the Jingle plugins directory
   - `C:\Users\<username>\.config\Jingle\plugins`
3. Restart Jingle, then open Plugins > MCSR Pace Widget tab
4. Click `open MCSR Pace Widget`, select a theme
5. Set the widget URL as an OBS browser source

## Settings

The `setting` and `theme` directories can be placed in either location (first takes priority):

1. Inside `~/.config/MCSRPaceWidget/`
2. In the same directory as `mcsr-pace-widget.jar`

### PB Time

To display the difference from your personal best, configure your PB times.

- Click `Pace Settings...` in the MCSRPaceWidget window (or Jingle tab)
- Enter times in `12:34` (12m34s) or `12:34.567` (12m34.567s) format

### Custom Themes

1. Copy a base theme (e.g., `default`) in the `theme` directory and rename it
2. Edit `setting.json` and the stylesheets `timeline.css` / `indicator.css`

A Minecraft font is bundled. Specify `font-family: 'Minecraft-Regular'` in your theme CSS for a more authentic look.

## Themes

<details>
<summary>Default / Texture-bar</summary>

<img src="docs/timeline_texture-bar.gif" alt="Default / Texture-bar timeline">
<img src="docs/indicator_texture-bar.gif" alt="Default / Texture-bar visual timeline">
</details>

<details>
<summary>Standard</summary>

<img src="docs/timeline_standard.gif" alt="Standard timeline">
<img src="docs/indicator_standard.gif" alt="Standard visual timeline">
</details>

<details>
<summary>Standard-full</summary>

<img src="docs/timeline_standard-full.gif" alt="Standard-full timeline">
<img src="docs/indicator_standard-full.gif" alt="Standard-full visual timeline">
</details>

<details>
<summary>Paceman (latest event only)</summary>

<img src="docs/timeline_paceman.gif" alt="Paceman timeline">
<img src="docs/indicator_paceman.gif" alt="Paceman visual timeline">
</details>

<details>
<summary>Paceman-list</summary>

<img src="docs/timeline_paceman-list.gif" alt="Paceman-list timeline">
<img src="docs/indicator_paceman-list.gif" alt="Paceman-list visual timeline">
</details>

<details>
<summary>Horizontal</summary>

<img src="docs/timeline_horizontal.gif" alt="Horizontal timeline">
</details>

<details>
<summary>Niwatori</summary>

<img src="docs/timeline_niwatori.gif" alt="Niwatori timeline">
<img src="docs/indicator_niwatori.gif" alt="Niwatori visual timeline">
</details>

## FAQ

**Q: Splits like Enter Bastion or Enter Fortress don't appear immediately**

A: Make sure "Auto Save Interval" is set to `Ticks` in SpeedRunIGT Options > Timer.
Without this setting, split data is not written in real time, causing delays.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and build instructions.

## Related

- [MCSRImageBuilder](https://github.com/mcrtabot/MCSRImageBuilder) — Web tool for generating timeline images from completed runs
