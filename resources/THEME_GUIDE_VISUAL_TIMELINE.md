# Visual Timeline CSS Reference

CSS reference for `indicator.css`. For general theme development, see [Theme Development Guide](THEME_GUIDE.md).

## HTML Structure

```
.mcsr-indicator                                     [data-segment] [data-run-status]
  .mcsr-indicator__line-container                   Background progress bars
    ::before                                        Empty track, full width
    .mcsr-indicator__line.mcsr-indicator__line--pb   PB progress segments
    .mcsr-indicator__line.mcsr-indicator__line--pace Pace progress segments
  .mcsr-indicator__dot-container                    Minute marker dots
    .mcsr-indicator__dot.mcsr-indicator__dot--track Track dots (only without a PB)
    .mcsr-indicator__dot.mcsr-indicator__dot--pb    PB dots
    .mcsr-indicator__dot.mcsr-indicator__dot--pace  Pace dots
  .mcsr-indicator__context-container                Context marker layer (opt-in)
    .mcsr-indicator__context                        [data-context] [data-label]
      .mcsr-indicator__context-icon                 Item icon (background-image)
  .mcsr-indicator__timeline-container--pb           PB icon layer
    .mcsr-indicator__item                           [data-segment] [data-status]
      .mcsr-indicator__icon-container
        .mcsr-indicator__icon                       Split icon (background-image)
  .mcsr-indicator__timeline-container--pace         Pace icon + text layer
    .mcsr-indicator__item                           [data-segment] [data-highlighted]
      .mcsr-indicator__icon-container
        .mcsr-indicator__icon                       Split icon (background-image)
      .mcsr-indicator__text
        .mcsr-indicator__text-inner
          .mcsr-indicator__text__label              Split name
          .mcsr-indicator__text__time               Split time
          .mcsr-indicator__text__diff               Diff vs PB
  .mcsr-indicator__face-container                   Face character
    .mcsr-indicator__face.mcsr-indicator__icon      Animated face icon
```

## Data Attributes

### `data-segment`

The current or item's segment type. Available on `.mcsr-indicator` (root) and `.mcsr-indicator__item` (each item).

| Value              | Segment                          |
| ------------------ | -------------------------------- |
| `enter_nether`     | Entered the Nether               |
| `enter_bastion`    | Entered a Bastion                |
| `enter_fortress`   | Entered a Fortress               |
| `first_portal`     | First Portal (returned to OW)    |
| `enter_stronghold` | Entered Stronghold               |
| `enter_end`        | Entered the End                  |
| `credits`          | Finished (credits roll)          |
| _(empty string)_   | No events yet (root only)        |

### `data-run-status`

On `.mcsr-indicator` (root). Overall run status.

| Value       | Description            |
| ----------- | ---------------------- |
| `running`   | Run in progress        |
| `completed` | Credits reached        |
| `empty`     | No splits yet          |

### `data-status`

On PB `.mcsr-indicator__item`.

| Value  | Description                    |
| ------ | ------------------------------ |
| `done` | Pace has passed this PB split  |
| `todo` | Pace has not reached this split|

### `data-align`

On Pace `.mcsr-indicator__item`. Whether this split sits close enough to the right edge
that its time, which runs down-right from the split, would be cut off. `credits` lands at
100% on every finished run, so its time is always at risk.

| Value   | Description                          |
| ------- | ------------------------------------ |
| `start` | Normal position                      |
| `end`   | Near the right edge (past 95%)       |

The `default` theme leaves this alone because `--id-edge-space` already reserves room on
both sides. `standard-full` and `paceman-list` keep their narrower margins and pull the
time left instead:

```css
.mcsr-indicator__item[data-align="end"] .mcsr-indicator__text {
  left: calc(-1 * var(--id-pace-text-end-shift, 64px));
}
```

`left` sits outside the rotation, so it moves the time horizontally without changing its
angle or its vertical position.

### `data-highlighted`

On Pace `.mcsr-indicator__item`. Whether this split is faster than PB.

| Value   | Description                |
| ------- | -------------------------- |
| `true`  | Split faster than PB       |
| `false` | Split same or slower than PB |

### `data-context`

On `.mcsr-indicator__context`. The context marker's type. Context markers are the points
inside a segment (getting iron, looting a bastion) rather than the segment boundaries, so
they live in their own layer and never affect how the bar is painted.

| Value                    | Marker                        |
| ------------------------ | ----------------------------- |
| `obtain_iron_ingot`      | Smelted the first iron        |
| `obtain_iron_pickaxe`    | Crafted an iron pickaxe       |
| `obtain_lava_bucket`     | Filled a lava bucket          |
| `distract_piglin`        | Distracted a piglin with gold |
| `loot_bastion`           | Looted a bastion chest        |
| `obtain_obsidian`        | Obtained obsidian             |
| `obtain_crying_obsidian` | Obtained crying obsidian      |
| `obtain_blaze_rod`       | Obtained a blaze rod          |

Every marker is drawn at its own position; markers close in time overlap rather than
being merged. `data-label` carries the marker's name and is available to CSS through
`attr(data-label)`.

Whether they are drawn is decided entirely by `--id-display-context`, which is `none`
unless the theme sets it. A theme that styles nothing here renders the markers at zero
size, so leaving the token alone costs nothing. Names come from `"contextLabel"` in
`setting.json`.

## Face Classes

| Class                           | Condition          |
| ------------------------------- | ------------------ |
| `.mcsr-indicator__face--normal` | Default face       |
| `.mcsr-indicator__face--smile`  | Ahead of PB pace   |
| `.mcsr-indicator__face--sad`    | Behind PB pace     |

## Line Segment Classes

Each line segment gets a type-specific class for per-biome textures:

| Class                                     | Segment                   |
| ----------------------------------------- | ------------------------- |
| `.mcsr-indicator__line--overworld`        | Spawn to Nether           |
| `.mcsr-indicator__line--enter_nether`     | Nether                    |
| `.mcsr-indicator__line--enter_bastion`    | Bastion                   |
| `.mcsr-indicator__line--enter_fortress`   | Fortress                  |
| `.mcsr-indicator__line--first_portal`     | First Portal to Overworld |
| `.mcsr-indicator__line--enter_stronghold` | Stronghold                |
| `.mcsr-indicator__line--enter_end`        | End                       |

## CSS Variables

Default values are from the `default` theme.

### Layout

| Variable      | Description           | Default  |
| ------------- | --------------------- | -------- |
| `--id-width`  | Total indicator width. `100%` fills the browser source | `100%` |
| `--id-offset` | Top padding           | `80px`   |

### Appearance

| Variable                        | Description                       | Default                                                                    |
| ------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `--id-text-color`               | Base text color                   | `rgba(255, 255, 255, 1)`                                                   |
| `--id-highlighted-text-color`   | Color for splits faster than PB   | `rgba(255, 128, 128, 1)`                                                   |
| `--id-highlighted-shadow-color` | Glow effect for highlighted icons | `rgba(255, 128, 128, 1)`                                                   |
| `--id-background`               | Indicator background              | `transparent`                                                              |
| `--id-font`                     | Font for labels                   | `normal bold 18px/1 sans-serif`                                            |
| `--id-digits-font-size`         | Size of the time digits. Split out of the shorthand so it can be changed on its own | `22px`                      |
| `--id-digits-font`              | Font for times/diffs              | built from `--id-digits-font-size` |

### Sizes

| Variable                 | Description                       | Default |
| ------------------------ | --------------------------------- | ------- |
| `--id-line-size`         | Progress bar height               | `24px`  |
| `--id-dot-size`          | Minute dot size                   | `10px`  |
| `--id-face-icon-size`    | Face character size               | `48px`  |
| `--id-pb-icon-size`      | PB split icon size                | `48px`  |
| `--id-pace-icon-size`    | Pace split icon size              | `48px`  |
| `--id-done-pb-icon-size` | PB icon size after pace passes it | `32px`  |
| `--id-pb-icon-offset`    | PB icon row vertical offset       | `-48px` |
| `--id-pace-icon-offset`  | Pace icon row vertical offset     | `0px`   |

### Track

The bar behind everything else, so the widget keeps its shape before the run fills it. With a PB
the PB segments cover it, so it only shows up when there is no PB — otherwise the runner's face
would float in empty space. Its minute dots are drawn the same way, across the full width.

| Variable                 | Description                            | Default |
| ------------------------ | -------------------------------------- | ------- |
| `--id-track-background`  | Track color. Matches the PB segments    | `#666`  |
| `--id-display-track`     | `none` hides the track and its dots     | shown   |

### Pace Text Placement

The time is rotated, so it runs away from its split in the direction of the rotation. These
separate the horizontal drift from the vertical clearance; mixing them into the rotated
`transform` moves the text diagonally and is what makes the time look detached from its split.

| Variable                    | Description                                                     | Default             |
| --------------------------- | --------------------------------------------------------------- | ------------------- |
| `--id-edge-space`           | Left and right padding. Equal on both sides, so the bar stays centred while both ends have room for a time | `64px`              |
| `--id-pace-text-gap`        | Distance from the split, along the rotated direction. `0` starts the text right at the split | one pace icon       |
| `--id-pace-text-offset`     | Drop below the bar. Unrotated, so raising it never shifts the text right | `24px`              |
| `--id-pace-text-end-shift`  | How far to pull a `data-align="end"` time left (unused by `default`) | `64px`              |

`--id-pace-text-push` is set by the theme itself and should not be overridden: it cancels
the row shift applied when there is no PB, which would otherwise drag the time onto the bar.

### Context Markers

| Variable                    | Description                                | Default                          |
| --------------------------- | ------------------------------------------ | -------------------------------- |
| `--id-context-icon-size`    | Marker icon size                           | `16px`                           |
| `--id-context-icon-offset`  | Marker row vertical offset                 | clears the bar                   |
| `--id-context-icon-opacity` | Marker icon opacity                        | `0.9`                            |
| `--id-context-space`        | Height the marker row claims. The time drops by this much while markers are shown, and returns to its usual place when they are not | icon size + 10px |

### Face Character

| Variable                       | Description                 | Default                      |
| ------------------------------ | --------------------------- | ---------------------------- |
| `--id-face-file`               | Default face image          | `url(/setting/face.png)`     |
| `--id-face-smile-file`         | Smile face image            | `url(/setting/face.png)`     |
| `--id-face-sad-file`           | Sad face image              | `url(/setting/face-sad.png)` |
| `--id-face-smile-shadow-color` | Glow color for smile        | `rgba(255, 128, 128, 1)`     |
| `--id-face-completed-offset`   | Face position on completion | `-48px`                      |
| `--mcsr-face-fallback`         | Face shown when the runner's skin cannot be loaded | `url(/setting/face.png)` |

### What the Bar Spans

By default the bar spans your PB, so the right edge is your PB's finish — until the run passes
it. From then on the bar grows a minute at a time, because a run that is already slower than
the PB would otherwise keep going off the right edge. Finishing lands the run exactly on the
right edge.

    IGT 8:40   -> spans 17:29 (the PB)
    IGT 17:29  -> spans 17:29, the run sits exactly at 100%
    IGT 17:30  -> spans 18:00
    IGT 20:00  -> spans 21:00
    finished at 26:40 -> spans 26:40

With no PB set, the bar uses those steps from the start, and never spans less than 13 minutes —
sub 13 is the line runners care about, and it keeps the first minute of a run from filling the
whole thing:

    IGT 1:00   -> spans 13:00, the run sits at 7.7%
    IGT 12:59  -> spans 13:00
    IGT 13:00  -> spans 13:00, the run sits exactly at 100%
    IGT 13:01  -> spans 14:00

Nothing has to be configured for this — without it every split would be positioned at 0% and
pile up at the left edge. The root element carries `data-has-pb`, so a theme can tell the two
situations apart.

The width it starts at and the unit it grows by are both settable in seconds, from the theme's
`setting.json`:

```json
{
  "scaleMinSeconds": 600,
  "scaleStepSeconds": 180
}
```

`scaleMinSeconds` is the width shown before the run reaches it (default 600 = 10 minutes), and
`scaleStepSeconds` is how much the bar grows each time it does (default 180), so the bar spans
10, then 13, then 16 minutes and so on. A theme for shorter categories might use `90` and `30`;
one that wants a smoother bar might use `600` and `10`. A step of 0 or less is treated as
1 second, so a bad value cannot break the layout.

Both can be overridden per widget URL with `?scaleMin=` and `?scaleStep=`, in seconds, which
is the quickest way to try a value before writing it into a theme:

    /indicator?theme=default&scaleMin=90&scaleStep=30

A value that is not a number is ignored, and the theme's setting (or the default) is used.

The PB row is drawn on whichever scale is in use. PB splits beyond the current length are left
out rather than drawn off-screen, so they come into view as the run gets longer.

### Runner's Skin as the Face

The widget hands the runner's own Minecraft skin to the theme as `--mcsr-skin-face`. Whether
to use it is the theme's call, expressed in its CSS:

```css
:root {
  /* use the skin, and fall back to the shared face when it cannot be loaded */
  --id-face-file: var(--mcsr-skin-face, url(/setting/face.png));
  --id-face-smile-file: var(--mcsr-skin-face, url(/setting/face.png));
  --id-face-sad-file: var(--mcsr-skin-face, url(/setting/face-sad.png));
}
```

A theme with its own face art simply does not reference the variable, and keeps its image —
the bundled `niwatori` theme works that way. Nothing names a theme on the widget side, so a
theme you write follows the same rule.

Note that the substitution happens where the property is **declared**, not where it is used,
so these have to be declared in `:root` for the variable to reach them.

The runner is resolved from `setting/player.json` first, then from the world save, so nothing
has to be typed in. `?face=theme` on the widget URL stops the skin being offered at all, and
`?face=skin` forces it onto the `--id-face-*` variables even on a theme that ignores it.

The root element carries `data-face="skin"` whenever a skin is on offer. The skin is a single
image and cannot change expression, so the bundled themes use that to keep the ahead/behind
states readable:

```css
.mcsr-indicator[data-face="skin"] .mcsr-indicator__face--sad {
  filter: grayscale(0.85) brightness(0.75);
}
```

`--mcsr-face-fallback` is only consulted by the `?face=skin` override; point it at your own
image if you want that override to fall back to the theme's art rather than the bundled one.

### Visibility Controls

Set to `none` to hide, or leave unset (commented out) to show.

| Variable                       | Target                    |
| ------------------------------ | ------------------------- |
| `--id-display-indicator-empty` | Indicator when no splits  |
| `--id-display-face-completed`  | Face after run completion |
| `--id-display-done-pb-item`    | PB icons already passed   |
| `--id-display-pace-text`       | Pace text labels          |
| `--id-display-pace-text-label` | Split name in pace text   |
| `--id-display-pace-text-time`  | Split time in pace text   |
| `--id-display-pace-text-diff`  | Diff in pace text         |
| `--id-display-context`         | Context marker layer (`none` by default) |
| `--id-display-track`           | Empty track and its minute dots |

### Text Layout

| Variable                        | Description                 | Default |
| ------------------------------- | --------------------------- | ------- |
| `--id-display-pace-text-rotate` | Rotation angle of pace text | `32deg` |
