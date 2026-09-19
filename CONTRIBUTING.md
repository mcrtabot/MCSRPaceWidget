# Contributing

## Prerequisites

- Node.js 18+
- Java 17+ (for server build)
- Maven 3.9+ (for server build)

## Setup

```bash
cd web
npm install

# Create symlinks for theme, icon and setting files
ln -s ../../resources/theme public/theme
ln -s ../../resources/icon public/icon
ln -s ../../resources/setting public/setting
```

## Development Server

```bash
npm start
```

Starts at http://localhost:3000.
The backend server must be running at http://localhost:1161 (see build instructions below).

To use demo data, append `?demo=1` to the URL (e.g. `http://localhost:3000/indicator?demo=1`).

## Build

### Frontend (Widget)

```bash
cd web
npm run build
```

### Server (Java)

```bash
mvn package -f ./server/pom.xml
```

After building, start the server with:

```bash
java -jar server/target/mcsr-pace-widget-jar-with-dependencies.jar
```

## Project Structure

```
web/
  src/
    components/     # React components
    pages/          # Page components (routing targets)
    hooks.ts        # Data fetching & shared hooks
    utils/          # Utility functions
    context.ts      # AppContext definition
    types.ts        # Type definitions
    assets/demo/    # Demo data
  public-widget/    # Static files for Widget
resources/
  theme/            # Theme CSS & settings
  icon/             # Shared split icon sets (icon/<set>/icons.json + images)
  setting/          # PB settings, runner id for the skin face, etc.
server/             # Java backend (NanoHTTPD)

Images added from the Theme Editor are written to `~/.config/MCSRPaceWidget/upload/`
and served from `/upload/`. `POST /api/upload` only accepts requests from 127.0.0.1.
```

## Theme Structure

Each theme is located at `resources/theme/<theme-name>/` and contains the following files:

- `setting.json` — Label and title settings, and `iconSet` (which shared icon set to use)
- `timeline.css` — Timeline table styles
- `indicator.css` — Visual timeline styles
- `icon/` — Event icon images (optional; only for themes that do not use a shared icon set)
