# Segment CSS Reference

CSS reference for `segment.css`. For general theme development, see [Theme Development Guide](THEME_GUIDE.md).

## HTML Structure

```
.mcsr-segment                                       [data-entering] [data-segment] [data-run-status] [data-highlighted]
  .mcsr-segment__background                         Background layer (per-segment class)
  .mcsr-segment__content                            Grid container
    .mcsr-segment__icon-area                        Icon container
      .mcsr-segment__icon                           Split icon (background-image)
    .mcsr-segment__label1                           Primary label (segment name)
    .mcsr-segment__label2                           Secondary label (optional)
    .mcsr-segment__label3                           Tertiary label (optional)
    .mcsr-segment__time                             Split time
    .mcsr-segment__diff                             Diff vs PB
  .mcsr-segment__decoration                         Decoration layer (per-segment class)
```

## Data Attributes

All attributes are on the root `.mcsr-segment` element.

### `data-segment`

| Value              | Segment                          |
| ------------------ | -------------------------------- |
| `enter_nether`     | Entered the Nether               |
| `enter_bastion`    | Entered a Bastion                |
| `enter_fortress`   | Entered a Fortress               |
| `first_portal`     | First Portal (returned to OW)    |
| `enter_stronghold` | Entered Stronghold               |
| `enter_end`        | Entered the End                  |
| `credits`          | Finished (credits roll)          |
| _(empty string)_   | No events yet                    |

### `data-run-status`

| Value       | Description            |
| ----------- | ---------------------- |
| `running`   | Run in progress        |
| `completed` | Credits reached        |
| `empty`     | No splits yet          |

### `data-entering`

| Value   | Description                                    |
| ------- | ---------------------------------------------- |
| `true`  | Segment just changed (for enter animation)     |
| `false` | Entering period ended or no change             |

### `data-highlighted`

| Value   | Description                  |
| ------- | ---------------------------- |
| `true`  | Current split faster than PB |
| `false` | Same or slower than PB       |

### Usage examples

```css
/* Style per segment */
.mcsr-segment[data-segment="enter_nether"] .mcsr-segment__icon-area {
  background-image: url(icon/enter_nether.png);
}

/* Animate on segment entry */
.mcsr-segment[data-entering="true"] {
  animation: fade-in 0.5s ease forwards;
}

/* PB pace styling */
.mcsr-segment[data-highlighted="true"] {
  color: gold;
}

/* Empty state (no events yet) */
.mcsr-segment[data-segment=""] .mcsr-segment__label1::after {
  content: "Overworld";
}
```

## Labels

Labels are defined in `setting.json` via `segmentLabel`. Each segment type maps to an array of strings:

```json
{
  "segmentLabel": {
    "enter_nether": ["Entered Nether", "Find a structure"],
    "credits": ["Complete", "Better luck next time...", "New PB!!"]
  }
}
```

- 1st element &rarr; `.mcsr-segment__label1`
- 2nd element &rarr; `.mcsr-segment__label2`
- 3rd element &rarr; `.mcsr-segment__label3`
- ...and so on (dynamic)

If `segmentLabel` is not defined for a type, falls back to `label`.

## Grid Layout

`.mcsr-segment__content` uses CSS Grid. Theme authors can freely rearrange elements via `grid-template`:

```css
/* Default layout */
.mcsr-segment__content {
  display: grid;
  grid-template:
    "icon label1" auto
    "icon time"   auto
    / auto 1fr;
}

/* Centered banner layout */
.mcsr-segment__content {
  display: grid;
  grid-template:
    ".      icon   label1 ." auto
    "label2 label2 label2 label2" auto
    / 1fr auto auto 1fr;
}
```

## CSS Variables

| Variable                | Description          | Default                                                                    |
| ----------------------- | -------------------- | -------------------------------------------------------------------------- |
| `--sg-text-color`       | Base text color      | `rgba(255, 255, 255, 1)`                                                   |
| `--sg-font`             | Font for labels      | `normal bold 18px/1 sans-serif`                                            |
| `--sg-digits-font`      | Font for times/diffs | `normal normal 22px/1 Minecraft-Regular, Minecraft, monospace, sans-serif` |
| `--sg-width`            | Widget width         | `auto`                                                                     |
| `--sg-background`       | Widget background    | `transparent`                                                              |
| `--sg-icon-size`        | Icon size            | `32px`                                                                     |

### Visibility Controls

Set to `none` to hide, or leave unset (commented out) to show.

| Variable                  | Target             |
| ------------------------- | ------------------ |
| `--sg-display-empty`      | Widget when empty  |
| `--sg-display-icon`       | Icon area          |
| `--sg-display-label1`     | Primary label      |
| `--sg-display-time`       | Split time         |
| `--sg-display-diff`       | Diff vs PB         |
| `--sg-display-background` | Background layer   |
| `--sg-display-decoration` | Decoration layer   |

## Entering Duration

The duration of `data-entering="true"` can be configured per theme in `setting.json`:

```json
{
  "enteringDuration": 5000
}
```

Default is 5000ms. CSS animations should match this duration.
