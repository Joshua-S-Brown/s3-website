# Second Self Studios — World Site

## Quick Start
1. Open this folder in VS Code
2. Install the "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

## How to Add Content

### New Location
1. Copy `templates/_location.html` to `pages/locations/your-location.html`
2. Edit content (look for EDIT comments)
3. Add a pin to `data/locations.json`
4. Commit and push

### New Story
1. Copy `templates/_story.html` to `pages/stories/your-story-slug.html`
2. Write your story in the prose section
3. Commit and push

### New Map Pin
Open `data/locations.json`, add an entry with coords, name, type, and page link.

## Map Setup
1. Drop any map image at `assets/images/world-map.jpg` (works immediately)
2. Later: slice into tiles with MapTiler or gdal2tiles
3. Switch from imageOverlay to tileLayer in `js/map.js` (see comments)

## Style Rules
- ALL styles live in `css/styles.css` — one file, one source of truth
- HTML uses only CSS classes — zero inline style attributes
- To change spacing, colors, or fonts: edit the CSS variables in :root
- To add new component styles: add them to styles.css

## Palette: Iron & Gold
| Role       | Hex       |
|------------|-----------|
| Background | #131313   |
| Card       | #1C1C1C   |
| Border     | #2C2C2C   |
| Body Text  | #C5C0B8   |
| Muted      | #808080   |
| Gold       | #C9A84C   |
| Teal       | #4ECDC4   |
| Heading    | #EDEBE8   |
