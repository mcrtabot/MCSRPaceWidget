# Visual Timeline CSS Reference

CSS reference for `indicator.css`. For general theme development, see [Theme Development Guide](THEME_GUIDE.md).

## HTML Structure

```
.mcsr-indicator                                     [data-segment] [data-run-status]
  .mcsr-indicator__line-container                   Background progress bars
    .mcsr-indicator__line.mcsr-indicator__line--pb   PB progress segments
    .mcsr-indicator__line.mcsr-indicator__line--pace Pace progress segments
  .mcsr-indicator__dot-container                    Minute marker dots
    .mcsr-indicator__dot.mcsr-indicator__dot--pb    PB dots
    .mcsr-indicator__dot.mcsr-indicator__dot--pace  Pace dots
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

### `data-highlighted`

On Pace `.mcsr-indicator__item`. Whether this split is faster than PB.

| Value   | Description                |
| ------- | -------------------------- |
| `true`  | Split faster than PB       |
| `false` | Split same or slower than PB |

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
| `--id-width`  | Total indicator width | `1280px` |
| `--id-offset` | Top padding           | `80px`   |

### Appearance

| Variable                        | Description                       | Default                                                                    |
| ------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `--id-text-color`               | Base text color                   | `rgba(255, 255, 255, 1)`                                                   |
| `--id-highlighted-text-color`   | Color for splits faster than PB   | `rgba(255, 128, 128, 1)`                                                   |
| `--id-highlighted-shadow-color` | Glow effect for highlighted icons | `rgba(255, 128, 128, 1)`                                                   |
| `--id-background`               | Indicator background              | `transparent`                                                              |
| `--id-font`                     | Font for labels                   | `normal bold 18px/1 sans-serif`                                            |
| `--id-digits-font`              | Font for times/diffs              | `normal normal 22px/1 Minecraft-Regular, Minecraft, monospace, sans-serif` |

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

### Face Character

| Variable                       | Description                 | Default                      |
| ------------------------------ | --------------------------- | ---------------------------- |
| `--id-face-file`               | Default face image          | `url(/setting/face.png)`     |
| `--id-face-smile-file`         | Smile face image            | `url(/setting/face.png)`     |
| `--id-face-sad-file`           | Sad face image              | `url(/setting/face-sad.png)` |
| `--id-face-smile-shadow-color` | Glow color for smile        | `rgba(255, 128, 128, 1)`     |
| `--id-face-completed-offset`   | Face position on completion | `-48px`                      |
| `--mcsr-face-fallback`         | Face shown when the runner's skin cannot be loaded | `url(/setting/face.png)` |

### Runner's Skin as the Face

The face character can show the runner's own Minecraft skin instead of the theme's image.
Turn it on with `"faceSkin": true` in the theme's `setting.json`, or with `?face=skin` on the
widget URL (`?face=theme` forces the theme's image back).

The widget resolves the runner from `setting/player.json` first, then from the world save,
so nothing has to be typed in for the common case. When it is on, the widget sets the three
`--id-face-*` variables to the skin image layered over `--mcsr-face-fallback`, and marks the
root element with `data-face="skin"`.

The skin is a single image, so it cannot change expression. Use `data-face="skin"` to keep
the ahead/behind states readable:

```css
.mcsr-indicator[data-face="skin"] .mcsr-indicator__face--sad {
  filter: grayscale(1) brightness(0.7);
}
```

A theme with its own face art should point `--mcsr-face-fallback` at it, so that a network
failure falls back to the theme's image rather than the bundled one:

```css
:root {
  --mcsr-face-fallback: url(/theme/my-theme/face.png);
}
```

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

### Text Layout

| Variable                        | Description                 | Default |
| ------------------------------- | --------------------------- | ------- |
| `--id-display-pace-text-rotate` | Rotation angle of pace text | `32deg` |
