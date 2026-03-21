# Visual Timeline CSS Reference

CSS reference for `indicator.css`. For general theme development, see [Theme Development Guide](THEME_GUIDE.md).

## HTML Structure

```
.mcsr-indicator                                     [data-segment] [data-status]
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

| Element                | Attribute          | Values                            | Description                            |
| ---------------------- | ------------------ | --------------------------------- | -------------------------------------- |
| `.mcsr-indicator`      | `data-segment`     | `enter_nether`, `credits`, etc.   | Current segment (last completed split) |
| `.mcsr-indicator`      | `data-status`      | `running` / `completed` / `empty` | Overall run status                     |
| PB `.mcsr-indicator__item`  | `data-segment` | `enter_nether`, `credits`, etc.   | This item's segment type               |
| PB `.mcsr-indicator__item`  | `data-status`  | `done` / `todo`                   | Whether pace has passed this PB split  |
| Pace `.mcsr-indicator__item`| `data-segment` | `enter_nether`, `credits`, etc.   | This item's segment type               |
| Pace `.mcsr-indicator__item`| `data-highlighted` | `true` / `false`              | Whether this split is faster than PB   |

## State Classes (legacy, kept for backward compatibility)

| Class                                | Equivalent data attribute                |
| ------------------------------------ | ---------------------------------------- |
| `.mcsr-indicator--running`           | `[data-status="running"]`                |
| `.mcsr-indicator--completed`         | `[data-status="completed"]`              |
| `.mcsr-indicator--empty`             | `[data-status="empty"]`                  |
| `.mcsr-indicator__item--highlighted` | `[data-highlighted="true"]`              |
| `.mcsr-indicator__item--normal`      | `[data-highlighted="false"]`             |
| `.mcsr-indicator__item--done`        | `[data-status="done"]`                   |
| `.mcsr-indicator__item--todo`        | `[data-status="todo"]`                   |
| `.mcsr-indicator__face--normal`      | (no equivalent — face-specific class)    |
| `.mcsr-indicator__face--smile`       | (no equivalent — face-specific class)    |
| `.mcsr-indicator__face--sad`         | (no equivalent — face-specific class)    |

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
