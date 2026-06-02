# Second Self Studios

Website for [Whisker & Wire](https://secondselfstudios.com), an illustrated fiction and tabletop RPG property I'm building. Post-human solarpunk world where small animals build civilization from human ruins.

Static site. No frameworks, no CMS. HTML, CSS, JS, and Leaflet.js for the interactive maps. Hosted on GitHub Pages.

## What's here

The site is the public face of an ongoing worldbuilding and creative project. Content goes up as I write, draw, and build. Some pages are stubs. The world takes shape over time.

- **Map** — Interactive Leaflet map of the world. Pins link to locations, characters, and stories.
- **Locations** — Places in the world. Each major settlement can have its own interactive sub-map.
- **Stories** — Short fiction. Each story happens somewhere specific on the map.
- **Characters** — The animals who live here.
- **Lore** — History, factions, and the rules the world runs on.
- **Journal** — Notes on the creative process.

## Structure

```
index.html                        → Homepage
css/styles.css                    → Single stylesheet
js/map.js                        → Leaflet map (data-driven, works on any page)
js/main.js                       → Nav highlighting
data/locations.json               → World map pins
data/solverde-locations.json      → Solverde town map pins
assets/images/                    → Maps, portraits, art
pages/
  map/index.html                  → Full-screen world map
  locations/
    index.html                    → Locations hub
    solverde.html                 → Location page with embedded sub-map
  stories/                        → Stories hub + individual stories
  characters/                     → Characters hub + individual pages
  lore/                           → Lore hub + entries
  journal/                        → Journal hub + entries
templates/                        → Copy-paste templates for each page type
```

## Adding content

Templates are in `templates/`. Copy one, rename it, fill in the content where the `EDIT` comments are, and add a card to the relevant hub page. For map pins, add entries to the appropriate JSON file.

Location pages that need their own interactive map follow the Solverde pattern: include Leaflet, add a map div with `data-image` and `data-pins` attributes pointing to the location's map image and JSON, and add a sidebar div. The map.js handles the rest.

## Credits

Built by Josh. Map rendering by [Leaflet.js](https://leafletjs.com). Fonts: Cormorant Garamond, Lora, and DM Sans via Google Fonts.