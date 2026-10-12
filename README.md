# Everyday Feelings, Shared Stories

The ways we care. The stories we bring.

SNOW DAY Learning Lab

A buildless, responsive research-and-practice prototype using semantic HTML, CSS, and vanilla JavaScript. The existing Sites project identity and public audience are retained in `.openai/hosting.json`.

## Run locally

Run `node preview.cjs`, then open `http://127.0.0.1:4173/`. Run `node tests/matching.cjs` for planning-guide behavior checks. JavaScript syntax can be checked with `node --check <file>`.

## Structure

- `dist/index.html`: shared landmarks, institutional identity, and native sensory-settings dialog.
- `dist/app.js`: hash navigation, sensory preferences, simulated observation dashboard, toolkit, and community views.
- `dist/lab-home.js`: welcoming home, SEL explanation, linked research foundations, and the five-question planning guide. Its pure `match()` function ranks resources by selected goal and supports; age, setting, and time determine guidance. Survey answers live only in page memory, not storage or a remote service.
- `dist/lesson-plans.js`: three complete original K–2 plans, explicit standards links, SEL intentions, home adaptations, and the maker workspace.
- `dist/buddy-studio.js`: child-facing animal design, coloring, topic-based SEL stories, and local video creation.
- `dist/buddy-stories.js`: nine original, four-page stories about sharing, safe hands, asking for help, feelings, friendship, curiosity, and calming.
- `dist/read-along.js`: cancellable browser speech controller. Word mode (default) highlights each word from actual speech start events, including voices without boundary events. Smooth mode uses native word boundaries when available, otherwise a sentence highlight. No estimated timing or automatic page turns.
- `dist/academic.css`: responsive academic interface, with semantic colors that inherit light, dark, and neutral themes.
- `dist/design-system.css`: the requested calming palette, three theme variants, shared card/button treatments, and accessible foreground/background roles. Amber is reserved for decorative accents; white text on teal and lavender exceeds 4.5:1. Artwork and user-selected coloring paints retain their independent colors; video captions resolve the screen theme's CSS tokens.
- `dist/accessibility.css`: focus styles, text scaling support, and reduced-motion behavior.

Run `node tests/palette.cjs` to verify the exact default palette and 66 foreground/background pairs across Light, Dark, and Neutral modes. This checks text contrast, not every WCAG criterion. Cards use a shared 12px radius; primary buttons use teal with white text and lavender on hover.

## Research and content boundaries

The home and research views link to CASEL, CAST UDL Guidelines 3.0, MIT constructionist learning resources, and official Teachers College/lab pages. Lesson plans link to NGSS and Common Core standards. Tally notation and comparative picture charts extend kindergarten classification with adult support. Extensions for older learners retain the original K–2 standards label.

Video recommendations link to original provider pages (Sesame Workshop, PBS KIDS, or MIT); they do not autoplay or embed trackers. Availability and captions remain provider-controlled. Written lesson steps offer a screen-free alternative.

This is a research prototype, not an institutionally certified intervention or validated assessment. Observation data are simulated. The survey suggests resources; it does not diagnose, rank, or infer a child's emotional state. Learner preferences, consent, and educator/caregiver judgment guide use.

Themes and maker reflections save on the current device. The planning survey resets on page reload. No camera or microphone data are collected.

## Buddy read-along

Choose Story time, a topic, a story, then Read with me. Pause resumes from the current word; page changes, leaving Buddy Studio, opening Comfort, and hiding the tab cancel speech. No microphone access is used. Voice availability and pronunciation depend on the browser; local English voices are preferred. The site does not store the selected topic or any child disclosure. Video exports retain captions and are silent.

Run `node tests/read-along.cjs` for speech cancellation, late events, resume/replay, boundary mapping, errors, and unavailable-voice behavior; run `node tests/stories.cjs` for story rendering contracts.

The title Everyday Feelings, Shared Stories places familiar language and family experience at the center of SEL. The home page recognizes the stories, languages, routines, and practical knowledge that connect families, communities, and schools, with a linked funds-of-knowledge source. The existing URL and repository identity are unchanged.
