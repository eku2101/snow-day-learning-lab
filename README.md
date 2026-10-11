# SNOW DAY Learning Lab

A buildless, responsive research-and-practice prototype using semantic HTML, CSS, and vanilla JavaScript. The existing Sites project identity and public audience are retained in `.openai/hosting.json`.

## Run locally

Run `node preview.cjs`, then open `http://127.0.0.1:4173/`. Run `node tests/matching.cjs` for planning-guide behavior checks. JavaScript syntax can be checked with `node --check <file>`.

## Structure

- `dist/index.html`: shared landmarks, institutional identity, and native sensory-settings dialog.
- `dist/app.js`: hash navigation, sensory preferences, simulated observation dashboard, toolkit, and community views.
- `dist/lab-home.js`: welcoming home, SEL explanation, linked research foundations, and the five-question planning guide. Its pure `match()` function ranks resources by selected goal and supports; age, setting, and time determine guidance. Survey answers live only in page memory, not storage or a remote service.
- `dist/lesson-plans.js`: three complete original K–2 plans, explicit standards links, SEL intentions, home adaptations, and the maker workspace.
- `dist/buddy-studio.js`: child-facing animal design, coloring, calming stories, and local video creation.
- `dist/academic.css`: responsive academic interface, with semantic colors that inherit light, dark, and neutral themes.
- `dist/design-system.css`: the requested calming palette, three theme variants, shared card/button treatments, and accessible foreground/background roles. Amber is reserved for decorative accents; white text on teal and lavender exceeds 4.5:1. Artwork and user-selected coloring paints retain their independent colors; video captions resolve the screen theme's CSS tokens.
- `dist/accessibility.css`: focus styles, text scaling support, and reduced-motion behavior.

Run `node tests/palette.cjs` to verify the exact default palette and 66 foreground/background pairs across Light, Dark, and Neutral modes. This checks text contrast, not every WCAG criterion. Cards use a shared 12px radius; primary buttons use teal with white text and lavender on hover.

## Research and content boundaries

The home and research views link to CASEL, CAST UDL Guidelines 3.0, MIT constructionist learning resources, and official Teachers College/lab pages. Lesson plans link to NGSS and Common Core standards. Tally notation and comparative picture charts extend kindergarten classification with adult support. Extensions for older learners retain the original K–2 standards label.

Video recommendations link to original provider pages (Sesame Workshop, PBS KIDS, or MIT); they do not autoplay or embed trackers. Availability and captions remain provider-controlled. Written lesson steps offer a screen-free alternative.

This is a research prototype, not an institutionally certified intervention or validated assessment. Observation data are simulated. The survey suggests resources; it does not diagnose, rank, or infer a child's emotional state. Learner preferences, consent, and educator/caregiver judgment guide use.

Themes and maker reflections save on the current device. The planning survey resets on page reload. No camera or microphone data are collected.
