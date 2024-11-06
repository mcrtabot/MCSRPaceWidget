# MCSR (Minecraft Speedruning) Pace Widget

## About

Minecraft Speedrun pace widget tool that displays your pace in real time.

## Requirement

- SpeedRunIGT 14.0 or later (use event log feature)
  - **Set "Auto Save Interval" ( in SpeedRunIGT Option > Timer) to `Ticks` for realtime update!**

## Features

- Display current run pace and time difference from PB.
- Display PB timeline.
- Display time indicator.
- Customizable themes.
- Real-time updates, multi-instance support.
- Easily displayed on OBS by using browser source.

### Timeline

<img src="docs/timeline_standard.gif">

### Indicator

<img src="docs/indicator_standard.gif">

## How to use

1. download from [Release Page](https://github.com/mcrtabot/MCSRPaceWidget/releases) and extract zip file.
2. execute `mcsr-pace-widget.jar`
3. click `open MCSR Pace Widget` (will open http://127.0.0.1:1161 on browser)
4. select theme and copy widget url.
5. use widget (e.g., in the OBS browser source)

### Settings

#### PB Time

If you want to see the difference from PB, edit `setting/pb.json`.

- The `type` can be the type of `event.log` output by SpeedrunIGT.
  - (ex `rsg.enter_nether`, use after the dot like `enter_nether`)
- `igt` is the `12:34` (12m34s) or `12:34.567` (12m34.567s) format of In-game Time

#### Custom Theme

- copy base theme (ex. default) and rename in `theme` directory
- edit `setting.json` and stylecsheet `timeline.css` / `indicator.css`

## Themes

- texture-bar

  <img src="docs/indicator_texture-bar.png">

- standard

  <img src="docs/timeline_standard.gif">
  <img src="docs/indicator_standard.gif">

- standard-full

  <img src="docs/timeline_standard-full.gif">
  <img src="docs/indicator_standard-full.gif">

- paceman (display latest event only)

  <img src="docs/timeline_paceman.gif">
  <img src="docs/indicator_paceman.gif">

- paceman-list

  <img src="docs/timeline_paceman-list.gif">
  <img src="docs/indicator_paceman-list.gif">

- horizontal

  <img src="docs/timeline_horizontal.gif">

- niwatori

  <img src="docs/timeline_niwatori.gif">
  <img src="docs/indicator_niwatori.gif">

and, your customize themes!

[Minecraft fonts](https://fontmeme.com/jfont/minecraft-font/) can be used for a more Minecraft-like look.
