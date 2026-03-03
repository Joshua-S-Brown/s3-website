# Second Self Studios

A fantasy worldbuilding project told through short fiction, hand-drawn maps, lore entries, and original art. Everything lives at [secondselfstudios.com](https://secondselfstudios.com).

## The World of Veridia

Three continents. Fading magic. Centuries of buried history.

Three hundred years ago, something called the Sundering broke the ley network that carried raw magic across the world. Empires fell. Cities went dark. The magic didn't disappear entirely but it got weaker, stranger, and harder to trust. The people who survived built new lives on top of the wreckage and tried not to think too hard about what they lost.

**Andoria** — Frozen fjords in the north, iron mountains in the south, and the Godsvein Valley running through the center. Its people are stubborn, insular, and built to endure.

**Kalendra** — A thousand lakes, a fertile crescent, and a desert that swallowed an empire. The center of the old world and the place the Sundering hit hardest.

**Morgard** — The Everwood. The Howling Plains. A coastline of drowned ruins and storms that never stop. The east keeps to itself.

## What This Is

This is a living project built in the open. The site is updated as new content is created. Some pages are stubs. Some regions are unnamed. The world takes shape over time.

Content types:
- **Map** — An interactive world map powered by Leaflet.js. Click any pin to learn about a location.
- **Locations** — Cities, landmarks, ruins, and regions with history, characters, and connected stories.
- **Stories** — Short fiction set in Veridia. Every story happens somewhere specific on the map.
- **Characters** — The people who live in this world. Discoverable through locations, stories, and the sidebar.
- **Lore** — Encyclopedia entries covering history, magic systems, factions, materials, and creatures.
- **Journal** — Notes on the creative process, design decisions, and what's being worked on.

## Site Architecture

Static HTML/CSS/JS hosted on GitHub Pages. No build tools, no frameworks, no CMS.

```
index.html                    → Full-screen interactive map (homepage)
css/styles.css                → Single stylesheet, Iron & Gold palette
js/map.js                     → Leaflet map with sidebar panel + landing overlay
js/main.js                    → Nav highlighting, audio player
data/locations.json           → Pin data for the world map
assets/images/                → Map images, character portraits, location art
pages/
  locations/
    index.html                → Locations hub
    kael-doran.html           → Sample location page
  stories/
    index.html                → Stories hub
    the-lamplighters-oath.html → Sample story page
  characters/
    index.html                → Characters hub
    sera-voss.html            → Sample character page
  lore/
    index.html                → Lore hub
    the-sundering.html        → Sample lore entry
  journal/
    index.html                → Journal hub
    why-im-building-a-world.html → Sample journal entry
templates/
  _location.html              → Copy-paste template
  _story.html                 → Copy-paste template
  _character.html             → Copy-paste template
  _lore.html                  → Copy-paste template
  _journal.html               → Copy-paste template
```

## Adding Content

Every page type has a template in `templates/`. Copy it, rename it, find the `EDIT` comments, and fill in your content. Add a card to the relevant hub page's `index.html` and a pin to `data/locations.json` if applicable.

## Credits

Built by Josh at Second Self Studios. Map rendering by [Leaflet.js](https://leafletjs.com). Fonts: Cormorant Garamond and Source Sans 3 via Google Fonts.
