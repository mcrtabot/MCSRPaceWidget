# Timeline CSS Reference

CSS reference for `timeline.css`. For general theme development, see [Theme Development Guide](THEME_GUIDE.md).

## HTML Structure

```
.mcsr-widget
  .mcsr-widget-container
    .timeline.timeline--pb                          PB timeline
      .timeline__title                              Title text
      .timeline__separator                          Horizontal rule
      .timeline__container                          <table>
        .timeline__item                             <tr> for each split
          .timeline__item__cell.timeline__item__cell__icon
            .timeline__item__icon                   Split icon (background-image)
          .timeline__item__cell.timeline__item__cell__label
            .timeline__item__label                  Split name text
          .timeline__item__cell.timeline__item__cell__time
            .timeline__item__time                   Split time
          .timeline__item__cell.timeline__item__cell__diff
            .timeline__item__diff                   Diff vs PB
    .timeline.timeline--pace                        Current pace timeline
      (same children as .timeline--pb)
```

## State Classes

| Class | Condition |
|---|---|
| `.timeline--empty` | No splits recorded yet |
| `.timeline__item--highlighted` | Split faster than PB |
| `.timeline__item--normal` | Split same or slower than PB |
| `.timeline__item--done` | Past split |
| `.timeline__item--current` | Latest split |
| `.timeline__item--next` | Next upcoming split |
| `.timeline__item--todo` | Future split |

## CSS Variables

Default values are from the `default` theme.

### Appearance

| Variable | Description | Default |
|---|---|---|
| `--tl-text-color` | Base text color | `rgba(255, 255, 255, 1)` |
| `--tl-highlighted-text-color` | Color for splits faster than PB | `rgba(255, 128, 128, 1)` |
| `--tl-background` | Timeline background | `transparent` |
| `--tl-font` | Font for labels | `normal bold 18px/1 sans-serif` |
| `--tl-digits-font` | Font for times/diffs | `normal normal 18px/1 Minecraft, monospace, sans-serif` |
| `--icon-size` | Split icon size | `24px` |
| `--tl-pb-timeline-width` | PB timeline width | `290px` |
| `--tl-pace-timeline-width` | Pace timeline width | `380px` |

### Visibility Controls

Set to `none` to hide, or leave unset (commented out) to show.

**PB Timeline:**

| Variable | Target |
|---|---|
| `--tl-display-pb-timeline` | Entire PB timeline |
| `--tl-display-pb-timeline-empty` | PB timeline when empty |
| `--tl-display-pb-timeline-title` | PB title |
| `--tl-display-pb-timeline-separator` | PB separator line |
| `--tl-display-pb-timeline-item-icon` | PB split icons |
| `--tl-display-pb-timeline-item-label` | PB split labels |
| `--tl-display-pb-timeline-item-time` | PB split times |
| `--tl-display-pb-timeline-item-diff` | PB split diffs |

**Pace Timeline:**

| Variable | Target |
|---|---|
| `--tl-display-pace-timeline` | Entire pace timeline |
| `--tl-display-pace-timeline-empty` | Pace timeline when empty |
| `--tl-display-pace-timeline-title` | Pace title |
| `--tl-display-pace-timeline-separator` | Pace separator line |
| `--tl-display-pace-timeline-item-icon` | Pace split icons |
| `--tl-display-pace-timeline-item-label` | Pace split labels |
| `--tl-display-pace-timeline-item-time` | Pace split times |
| `--tl-display-pace-timeline-item-diff` | Pace split diffs |
| `--tl-display-pace-timeline-item-status-done` | Completed splits |
| `--tl-display-pace-timeline-item-status-current` | Current split |
| `--tl-display-pace-timeline-item-status-next` | Next split |
| `--tl-display-pace-timeline-item-status-todo` | Future splits |
