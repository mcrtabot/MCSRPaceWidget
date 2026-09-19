# MCSR (Minecraft Speedrunning) Pace Widget

[日本語の README はこちら](README.ja.md)

A pace display widget that enhances your Minecraft speedrun (RSG) streams.
Integrates with SpeedRunIGT to show split times and comparisons against your target pace in real time.
Set your PB, goal times, or any custom pace as the baseline —
works as an OBS browser source, just pick a theme and add it to your scene.

<img src="docs/timeline_texture-bar.gif" alt="Timeline display example">
<img src="docs/indicator_texture-bar.gif" alt="Visual timeline display example">

## Quick Start

Requires SpeedRunIGT 14.0 or later and Java 8 or later.
**Set "Auto Save Interval" (SpeedRunIGT Options > Timer) to `Ticks`** — without it, splits are not written in real time.
The widget checks this for you and says so on its page if it is set to anything else.

1. Download `mcsr-pace-widget.jar` from the [Release Page](https://github.com/mcrtabot/MCSRPaceWidget/releases)
2. Start it in either way
   - **Standalone**: run `mcsr-pace-widget.jar`
   - **Jingle plugin**: copy it to `C:\Users\<username>\.config\Jingle\plugins` and restart Jingle
3. Add a browser source in OBS with this URL

   ```
   http://127.0.0.1:1161/indicator?theme=default
   ```

   To stretch it horizontally, change the browser source's **Width**.

That is all. Everything the widget needs is inside the jar.

## Widgets

Change the path in the URL to switch widgets. Every widget takes `?theme=<name>`.

| Widget | URL | What it shows |
| --- | --- | --- |
| Visual Timeline | `/indicator?theme=default` | Bar-style progress with your position against the target pace |
| Timeline | `/timeline?theme=default` | Table of split times and the difference from the target pace |
| Segment | `/segment?theme=default` | The current segment, with enter animations (banner, persistent, etc.) |

Runs under 13 minutes are retimed the MCSR way (pause time is adjusted automatically).

## Next Steps

### Set a target pace to see the difference

The widgets work without it — the Visual Timeline scales itself to the run when no PB is set.
Set your PB (or any goal pace) and every widget shows the difference from it.

- Click `Pace Settings...` in the MCSRPaceWidget window (or the Jingle tab)
- Enter times in `12:34` (12m34s) or `12:34.567` (12m34.567s) format

### Pick a theme

Open http://127.0.0.1:1161 (or click `Open MCSR Pace Widget`), pick a theme for each widget and copy
the URL.

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
<summary>Horizontal-timeline</summary>

<img src="docs/timeline_horizontal.gif" alt="Horizontal-timeline">
</details>

<details>
<summary>Niwatori</summary>

<img src="docs/timeline_niwatori.gif" alt="Niwatori timeline">
<img src="docs/indicator_niwatori.gif" alt="Niwatori visual timeline">
</details>

### Tweak a theme without CSS

Press `Customize...` next to the theme on the top page (or open http://127.0.0.1:1161/customize).
The Theme Editor lets you adjust colors, fonts, sizes and which parts are shown, and gives you a
widget URL that carries your changes — paste that into OBS. Nothing is written to disk, and the
link can be shared as-is.

## Advanced

### The config folder

On its first launch the widget creates `~/.config/MCSRPaceWidget` (on Windows,
`C:\Users\<username>\.config\MCSRPaceWidget`) and copies the bundled files into it.
`Open Config Folder` in the MCSRPaceWidget window (or the Jingle tab) opens it.

| Path | What it is |
| --- | --- |
| `setting/pb.json` | Target pace, what `Pace Settings...` writes |
| `setting/player.json` | Minecraft ID or UUID for the skin face (see below) |
| `theme/<name>/` | Themes. Add your own here |
| `icon/<set>/` | Split icon sets |
| `upload/` | Images added from the Theme Editor |

Files here take priority over the bundled ones, and the folder is never overwritten once it
exists. New themes and icon sets that ship with a later release still show up in the lists, so
updating is just replacing the jar.

### Runner's skin as the face

The Visual Timeline's face character shows your own Minecraft skin. This is on by default and
the account is detected from the run data, so there is nothing to enter. Themes that ship their
own face art keep it (the bundled `niwatori` theme does) — that is decided by the theme's CSS.

- `?face=theme` on the widget URL uses the theme's image instead, `?face=skin` forces the skin
- To use a different account (for example when streaming someone else's run), set `id` in
  `setting/player.json` to a Minecraft ID or UUID
- If the skin cannot be loaded, the theme's own face image is shown

### Icon sets

Split icons come from the shared sets in `icon/` (`default`, `paceman`, `paceman-stat`).
A theme picks one with `"iconSet"` in its `setting.json`. Add `?icons=<set>` to the widget URL
to try another set without editing files.

### Custom themes

1. In the config folder, copy a base theme (e.g. `theme/default`) and rename it
2. Edit `setting.json` and the stylesheets (`timeline.css` / `indicator.css` / `segment.css`)
3. Open http://127.0.0.1:1161/playground to preview it with various data patterns

Only include the CSS files your theme supports. The server detects supported widgets by the presence of each file.
A Minecraft font is bundled — use `font-family: 'Minecraft-Regular'` in your CSS for a more authentic look.

For the CSS reference, see the [Theme Development Guide](resources/THEME_GUIDE.md).

## FAQ

**Q: Splits like Enter Bastion or Enter Fortress don't appear immediately**

A: Make sure "Auto Save Interval" is set to `Ticks` in SpeedRunIGT Options > Timer.
Without this setting, split data is not written in real time, causing delays.

**Q: I updated the jar but don't see the new themes**

A: Bundled themes are merged with the ones in your config folder, so they should appear after a
restart. If a theme with the same name exists in your config folder, that copy is used.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and build instructions.

## Related

- [MCSRImageBuilder](https://github.com/mcrtabot/MCSRImageBuilder) — Web tool for generating timeline images from completed runs
