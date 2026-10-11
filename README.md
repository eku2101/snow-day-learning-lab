# SNOW Day Learning Studio

Buildless HTML/CSS/vanilla JavaScript prototype. Serve `dist/` with any static HTTP server.

Features: overview dashboard, detailed standards-aligned lesson plans, a maker workspace with a visual schedule and per-lesson reflection storage, student companion, local kit cart and demo orders, local educator contributions and parent reflections, and editable ECD thresholds.

Sensory settings provide Default Light, High Contrast Dark, and Low Sensory Neutral themes; 100%, 115%, and 130% text scaling; larger targets; reduced motion; and narration preferences. Settings persist locally and migrate the original profile names. Hash navigation supports direct links and browser back/forward. A skip link, keyboard focus indicators, native modal dialogs, and responsive layouts support access.

`dist/lesson-plans.js` contains the three original teaching plans and lesson/workspace views. Standards links point to NGSS and Common Core primary sources. Tally notation and chart construction are marked as supported extensions of kindergarten classification and counting. SEL intentions are not presented as formal NGSS standards.

All records persist in browser localStorage. No live sensors, shared accounts, real orders, payments, or delivery integration. The decision rules are illustrative hypotheses and are not validated SEL assessments. Research framing follows the supplied brief; no claim of empirical validation or completed co-design is made.

Dark text maintains readability on calm pastel surfaces. Styles are self-contained CSS rather than Tailwind so this buildless prototype does not depend on a runtime CSS CDN. Optional Google fonts have system fallbacks.
