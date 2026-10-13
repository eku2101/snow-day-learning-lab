# Everyday Feelings, Shared Stories

**SNOW DAY Learning Lab**

*The ways we care. The stories we bring.*

A responsive social-emotional learning (SEL) and maker education prototype for children, educators, and families. The platform connects everyday experiences, family stories, and community knowledge with opportunities to make, reflect, and practice caring conversations.

**[Visit the public website](https://snow-day-learning-studio.eku2101.chatgpt.site/)** · **[Open Write & Role-play](https://snow-day-learning-studio.eku2101.chatgpt.site/#roleplay)** · **[Open Buddy Studio](https://snow-day-learning-studio.eku2101.chatgpt.site/#companion)**

The site's institutional framing is SNOW DAY Learning Lab · Department of Mathematics, Science & Technology · Teachers College, Columbia University. This repository contains a research-and-practice prototype; it does not establish institutional approval, clinical validation, or assessment validity.

## What you can explore

| Section | Experience |
| --- | --- |
| Home | An accessible introduction to SEL and a five-question classroom or household planning guide that matches lessons, making activities, and external video resources. |
| Lesson Plans | Three structured early STEM and SEL lessons with materials, standards, activity steps, sensory supports, and home adaptations. |
| Maker Studio Workspace | A guided making workspace with lesson selection, activity progress, reflections, and an optional quiet break. |
| Buddy Studio | Design a stuffed-animal character, color or print its picture, and explore nine original SEL stories with optional read-aloud. |
| Write & Role-play | Writing supports for grades 4–12, sentence starters, optional ideas, and scripted practice conversations. |
| Observation Dashboard | Simulated learner activity and illustrative support suggestions for educator discussion. |
| Community Exchange | Demonstration educator posts and caregiver reflections saved on the current device. |
| Research & Rules | Research framing and an editable evidence-centered design rule demonstration. |
| Toolkit Builder | A sample physical-kit builder with a cart and demo orders. No payments or shipments are created. |

## Start locally

You need Node.js and a modern web browser. The project uses HTML, CSS, and vanilla JavaScript; there is no package installation or build step.

```sh
git clone https://github.com/eku2101/snow-day-learning-lab.git
cd snow-day-learning-lab
node preview.cjs
```

Open **http://127.0.0.1:4173/**. Stop the preview with **Ctrl+C**. Cloning requires access to the repository; the published website is public.

If you already have a checkout, run `node preview.cjs` from its root. The preview server serves `dist/` and listens only on the local computer.

## Learning experiences

### Standards-aligned lesson plans

| Lesson | Making and learning | Standards referenced in the lesson |
| --- | --- | --- |
| Animal Habitat Sorting & Tally Charts | Sort animals by habitat, collect tally data, and construct comparative charts. | NGSS K-ESS3-1; Common Core K.MD.B.3 |
| Tactile Storytelling & Sensory Boards | Combine textures, story maps, and optional audio switches to support inclusive communication and engineering design. | NGSS K-2-ETS1-1 and K-2-ETS1-2 |
| Light Shields & Habitats | Design shade structures, observe sunlight and temperature, and consider habitat protection. | NGSS K-PS3-2 and K-PS3-1 |

These are original K–2 plans with linked standards and adaptations. Tally notation and comparative picture charts are adult-supported extensions. Suggestions for older learners retain the original standards labels rather than claiming new grade-level alignment.

### Buddy Studio and read-along stories

Learners choose a bear, bunny, kitten, or fox, personalize its appearance, and create coloring pages. Story topics include calming, sharing and turns, safe hands and help, feelings, friendship, and curiosity.

Select **Story time → a topic → a story → Read with me**. Learners control reading, pausing, replaying, and page changes.

- Word mode highlights words using speech-start events; smooth mode uses native word boundaries when available and a phrase highlight otherwise.
- Narration does not turn pages automatically or request microphone access.
- Leaving Buddy Studio, opening Comfort, or hiding the tab stops narration.
- Supported browsers can create captioned, silent story videos locally. Export availability and format depend on browser support.

### Write & Role-play for older learners

**[Open the writing space](https://snow-day-learning-studio.eku2101.chatgpt.site/#roleplay)** and select writing support for grades **4–6**, **7–9**, or **10–12**. Any learner can choose the support that works for them.

Six topics invite practice around family changes or divorce, school feeling overwhelming, friendship difficulties, needing a break, feeling heard, or a topic of the learner's own.

Each practice has three invitations:

1. **What I'm feeling:** put an experience or frustration into words.
2. **What helps me:** identify a helpful routine, person, place, or way of caring.
3. **What I want to ask:** practice requesting support or expressing a need.

Learners can choose sentence starters, add optional suggested phrases, or write entirely in their own words. Suggestions append to existing writing. Switching starters preserves separate drafts during the practice. Prompts may be skipped, and fictional situations are welcome.

The conversation partner uses clearly labeled, scripted example responses. The app does not analyze a learner's writing, generate a personalized counseling response, or send their words to another person. Optional read-aloud uses only voices the browser identifies as on-device. If none are available, the writing experience remains usable without audio.

Writing clears when the learner leaves this section, reloads, or confirms **Clear** or **Finish**. Taking a pause keeps the current draft. Opening Sensory settings or hiding the tab pauses narration.

## Sensory and accessibility controls

Open **Sensory settings** from the header. Changes apply immediately:

- Default Light, High Contrast Dark, and Low Sensory Neutral themes.
- Text scaling at 100%, 115%, or 130%.
- Larger touch targets and reduced motion.
- Companion narration preferences and adjustable narration speed.

The interface uses semantic page landmarks, labeled controls, visible focus styles, a skip link, and responsive layouts. Cards share a 12px corner radius. Primary buttons use slate teal with white text and lavender hover states.

The palette test checks 66 foreground/background text pairs across all three themes against a 4.5:1 contrast threshold. This is a focused contrast check, not a full WCAG conformance audit. Animal artwork and user-selected paint colors have independent palettes.

## Data and privacy

The application has no shared application database. Browser-local storage is specific to the current browser and site; it does not sync across devices.

| Data | Current behavior |
| --- | --- |
| Sensory settings, Buddy design, and artwork | Saved in browser `localStorage`. |
| Maker progress and reflections | Saved in browser `localStorage`. |
| Community posts, caregiver feedback, demo kit orders, and observation check-ins | Demonstration data saved in browser `localStorage`; not delivered to other users. |
| Research rule settings | Saved in browser `localStorage`. |
| Planning-guide answers | Kept in page memory and reset on reload. Selecting a matched maker lesson can save its lesson ID. |
| Write & Role-play drafts and practice lines | Kept only in memory while the section is open; never persisted or submitted by the app. |
| Coloring pages, pictures, and videos | Saved as files only when the learner requests an export. |

No camera, microphone, or physical sensor input is collected. Dashboard telemetry is simulated. Role-play narration requires an on-device voice; Buddy narration prefers a local English voice but may use another browser-provided voice. Browser or operating-system speech services determine how those other voices work.

External learning resources open provider websites. Their availability, captions, and privacy practices are controlled by those providers. Recommended videos are linked rather than embedded or played automatically.

The GitHub backup contains website source and version history. It does not include browser-local learner entries or role-play drafts. Clearing browser site data removes locally saved preferences and activities.

## Research framing and limits

The design draws on constructionism, Universal Design for Learning, SEL, inclusive assistive technology, and families' funds of knowledge. The website links to resources from CASEL, CAST, MIT, Teachers College, and the Snow Day Learning Lab, alongside official standards references.

The research view also presents evidence-centered design and stealth assessment, the supplied *Playful Testing* framing, and illustrative multimodal learning analytics. Teacher and learner co-design remains future research work. Dashboard labels and adjustable thresholds are hypotheses for discussion, not validated measures of a child's emotions, ability, or needs.

The planning guide suggests resources; it does not diagnose or rank learners. Role-play is a writing practice, not a counseling service. Its family-change guidance links to the American Academy of Pediatrics. Learner choice and educator or caregiver judgment guide use throughout.

## Project structure

```text
snow-day-learning-lab/
├── .openai/hosting.json    # Existing Sites identity and static hosting configuration
├── dist/
│   ├── index.html         # Shared page structure and sensory-settings dialog
│   ├── app.js             # Navigation, preferences, and demonstration views
│   ├── lab-home.js        # Home page and planning-guide matching
│   ├── lesson-plans.js    # Lesson library and maker workspace
│   ├── buddy-studio.js    # Animal design, coloring, story playback, and video export
│   ├── buddy-stories.js   # Nine original four-page stories
│   ├── read-along.js      # Shared speech and highlighting controller
│   ├── roleplay-data.js   # Topics, grade-band starters, and example responses
│   ├── roleplay.js        # Writing workflow and optional local-voice narration
│   └── *.css              # Layouts, design tokens, themes, and accessibility styles
├── tests/                 # Node.js behavior and contrast checks
├── preview.cjs            # Local static preview server
└── README.md
```

Navigation uses URL hashes, including `#home`, `#curriculum`, `#studio`, `#companion`, and `#roleplay`. Modules are loaded with plain script tags; there is no framework or bundler.

## Validation

Run the existing checks from the repository root:

```sh
node tests/matching.cjs
node tests/stories.cjs
node tests/read-along.cjs
node tests/roleplay.cjs
node tests/palette.cjs
```

These cover planning-guide matching, story rendering contracts, speech cancellation and highlighting, local-only voice handling, role-play writing scaffolds, and theme contrast. Check an individual JavaScript file's syntax with `node --check dist/app.js` or the relevant file path.

For interface changes, also review keyboard navigation, mobile layouts, all three themes, text scaling, available speech voices, and clearing behavior in a browser. Automated checks do not replace these interaction checks.

## Editing and hosting

Edit source directly in `dist/` and refresh the local preview. Keep theme colors in `design-system.css`, lesson content in `lesson-plans.js`, and role-play content in `roleplay-data.js`. Preserve learners' ability to skip, pause, and write in their own words.

The public site is hosted with Sites. `.openai/hosting.json` identifies the existing project and sets `dist` as its static directory. Keep that project ID when updating the existing site. Saving changes to GitHub backs up the repository; publishing website changes is a separate Sites operation.

## License

No license file is currently included in this repository. Contact the project owner about permission to reuse or redistribute the code and original content.
