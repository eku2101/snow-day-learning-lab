/* Home content and a transparent planning guide. Answers remain in memory;
   matching is a teaching suggestion, never a measure of a child's abilities. */
window.LabHome = (() => {
  const questions = [
    { key: "role", title: "Where will you be learning?", hint: "Choose the setting for this invitation.", options: [
      ["classroom", "Educator / Classroom", "Shared explorations and flexible group roles"],
      ["household", "Parent / Household", "Everyday materials and time together"]
    ] },
    { key: "age", title: "Who are you planning with?", hint: "Choose a developmental band. You can adapt every activity.", options: [
      ["early", "Early Childhood · PreK–K", "Explore with an adult, one step at a time"],
      ["elementary", "Elementary · Grades 1–5", "Build, collect evidence, and share ideas"],
      ["middle", "Middle School · Grades 6–8", "Extend a design and reflect on access"],
      ["high", "High School · Grades 9–12", "Co-design, evaluate, and revise"]
    ] },
    { key: "needs", title: "What would make participation easier?", hint: "Choose all that help. Preferences can change from day to day.", multiple: true, options: [
      ["tactile", "Tactile exploration", "Optional textures and hands-on materials"],
      ["quiet", "Low sensory stimulation", "A calm workspace with fewer inputs"],
      ["visual", "High visual support", "Picture cues and a predictable sequence"],
      ["communication", "Communication choices", "AAC, pointing, audio switches, or words"],
      ["movement", "Movement & flexible positioning", "Seated, standing, and moving options"],
      ["flexible", "Still exploring", "Begin with choice and observe together"]
    ] },
    { key: "goal", title: "What would you like to nurture?", hint: "Choose one focus for today. There is no score to reach.", options: [
      ["regulation", "Emotional regulation", "Notice feelings and choose a helpful pause"],
      ["collaboration", "Peer & family collaboration", "Listen, take turns, and make together"],
      ["transitions", "Transition support", "Make the next step feel more predictable"],
      ["expression", "Expressing needs & feelings", "Communicate in a comfortable way"],
      ["persistence", "Confidence with challenges", "Try, reflect, ask for help, and revise"]
    ] },
    { key: "time", title: "How much time feels right?", hint: "A short start is valuable. You can return to the full lesson later.", options: [
      ["short", "10–15 minutes", "A small invitation to begin"],
      ["medium", "20–30 minutes", "One focused making session"],
      ["full", "40–60 minutes", "A complete exploration with reflection"]
    ] }
  ];
  const videos = {
    regulation: { title: "Teaching Belly Breathing", provider: "Sesame Workshop", url: "https://sesameworkshop.org/resources/teaching-belly-breathing/", purpose: "Model an optional pause together; learners may watch or choose another comfortable strategy." },
    collaboration: { title: "Twiddlebugs Take Turns", provider: "Sesame Workshop", url: "https://sesameworkshop.org/resources/twiddlebugs-take-turns/", purpose: "Pause to discuss how two makers might share a material or choose different roles." },
    transitions: { title: "School Routines, Home Routines", provider: "Sesame Workshop", url: "https://sesameworkshop.org/resources/school-routines-home-routines/", purpose: "Notice a familiar routine, then sketch the first, next, and last steps of your own." },
    expression: { title: "Twiddlebugs Take Turns", provider: "Sesame Workshop", url: "https://sesameworkshop.org/resources/twiddlebugs-take-turns/", purpose: "Invite learners to show a preference with words, symbols, gestures, or a communication aid." },
    persistence: { title: "How Shadows Are Made", provider: "PBS KIDS · The Cat in the Hat", url: "https://pbskids.org/videos/watch/how-shadows-are-made/34277", purpose: "Use this introduction to blocked light before testing a shade structure. Shadows alone do not show temperature change." },
    older: { title: "Learning through making: the Creative Learning Spiral", provider: "MIT · Learning Creative Learning", url: "https://lcl.media.mit.edu/weeks/week2/", purpose: "Watch Mitch Resnick’s introduction, then connect imagine, create, play, share, and reflect to your design." }
  };
  const adaptations = {
    tactile: "Offer a small tray of large textures; let the learner choose, use a tool, or decline touch.",
    quiet: "Use a clear work surface, a quiet corner, and one material at a time. Keep video and sound optional.",
    visual: "Preview a picture schedule and show one finished example alongside the current step.",
    communication: "Keep an AAC board, pointing options, or an optional low-volume audio switch within reach; wait for a response.",
    movement: "Offer standing or seated work, materials within reach, and voluntary movement breaks.",
    flexible: "Offer two ways to participate and ask which feels comfortable before adding more materials."
  };
  const ageNotes = {
    early: "PreK adaptation: start with three objects and adult modeling. The linked standards describe kindergarten goals, not PreK expectations.",
    elementary: "Grades 1–2: use the core sequence. Grades 3–5: add learner-designed categories, repeated trials, or a written design explanation. Base standards remain K–2.",
    middle: "Grades 6–8 extension: co-design with a consenting partner, define an access criterion, compare two prototypes, and explain limitations. This is an extension of a K–2 plan, not a middle-school standards claim.",
    high: "Grades 9–12 extension: define a design question with users, document decisions, compare evidence across trials, and critique whose needs the design serves. Map to your local course standards; the base plan is K–2."
  };
  const makerTitles = { habitats: "Build a habitat sorting mat", sensory: "Make a choice-led story board", shields: "Prototype a shade shelter" };
  const shortStarts = {
    habitats: "Sort three animal pictures, pair each with a needed resource, and record one mark per picture. Save the comparative chart for another session.",
    sensory: "Choose two comfortable materials and make one story panel or first–next card. Try one communication choice together.",
    shields: "Sketch a canopy and build one small model. Schedule the paired sunlight-and-shade observation for a later session."
  };
  let answers = { needs: [] }, step = 0, finished = false;
  const label = (key, value) => questions.find(q => q.key === key)?.options.find(o => o[0] === value)?.[1] || "";

  // Pure matching function: focus weighs 3, each selected support weighs 2.
  // Equal scores retain the library's order. Context changes the adaptation,
  // duration, and video audience, rather than pretending to assess a learner.
  function match(input) {
    const weights = { habitats: 0, sensory: 0, shields: 0 };
    const goals = { regulation: "sensory", collaboration: "habitats", transitions: "sensory", expression: "sensory", persistence: "shields" };
    weights[goals[input.goal] || "habitats"] += 3;
    const supports = { tactile: "sensory", quiet: "sensory", visual: "habitats", communication: "sensory", movement: "shields" };
    (input.needs || []).forEach(need => { if (supports[need]) weights[supports[need]] += 2; });
    const ranked = Object.keys(weights).sort((a, b) => weights[b] - weights[a]);
    return { lessonId: ranked[0], alternativeId: ranked[1], video: videos[["middle", "high"].includes(input.age) ? "older" : input.goal] || videos.regulation,
      adaptations: (input.needs || []).map(need => adaptations[need]).filter(Boolean), ageNote: ageNotes[input.age],
      context: input.role === "household" ? "At home: use a tray or a cleared table, invite a family member to join, and let your child choose when to pause." : "In a classroom: offer pairs or individual stations, rotate optional material and recording roles, and make a quiet workspace available.",
      timeNote: input.time === "short" ? shortStarts[ranked[0]] : input.time === "medium" ? "Complete the planning and making stages today. Return to data collection and reflection in a second session; this is a shortened start, not the complete lesson." : "Follow the full timed sequence, allowing extra time for breaks, communication, and outdoor observations."
    };
  }
  function sectionHead(kicker, title, text = "") {
    return `<div class="lab-section-heading"><p class="eyebrow">${kicker}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
  }
  function frameworkHTML() {
    return `<section class="lab-section framework-section" aria-label="Research frameworks">
      ${sectionHead("THEORY INTO PRACTICE", "Four lenses. Many ways to participate.")}
      <div class="framework-grid">
        <article class="card"><span class="lab-number">01</span><h3>Constructionism</h3><p>Make something meaningful, discuss an idea, and revise it. The artifact gives learners a shared object to think with.</p><a href="https://el.media.mit.edu/logo-foundation/what_is_logo/logo_and_learning.html" target="_blank" rel="noopener noreferrer">MIT · Logo and Learning ↗</a></article>
        <article class="card"><span class="lab-number">02</span><h3>Universal Design for Learning</h3><p>Offer choices in engagement, representation, and action or expression from the start, so access is part of the design.</p><a href="https://udlguidelines.cast.org/" target="_blank" rel="noopener noreferrer">CAST · UDL Guidelines 3.0 ↗</a></article>
        <article class="card"><span class="lab-number">03</span><h3>Social-Emotional Learning</h3><p>Practice understanding feelings, caring for others, and making thoughtful choices within meaningful learning activities.</p><a href="https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/" target="_blank" rel="noopener noreferrer">CASEL · The five competencies ↗</a></article>
        <article class="card"><span class="lab-number">04</span><h3>Inclusive Assistive Technology</h3><p>Co-design tools around the learner’s preferred ways of communicating and making: AAC, stabilized materials, tactile cues, and optional switches.</p><a href="https://udlguidelines.cast.org/action-expression/interaction/" target="_blank" rel="noopener noreferrer">CAST · Accessible interaction ↗</a></article>
      </div>
      <p class="source-note">Design foundations guide this prototype; its recommendations and observation rules have not been validated as measures of SEL. Standards alignment describes intended lesson content, not institutional certification.</p>
    </section>`;
  }
  function homeArt() {
    return `<div class="lab-hero-art" aria-hidden="true"><div class="lab-art-label">A SMALL INVITATION TO EXPLORE</div>
      <svg viewBox="0 0 440 300" focusable="false"><rect x="35" y="22" width="300" height="222" rx="9" fill="var(--bg-surface)" stroke="var(--border-subtle)"/><path d="M59 63H308M59 201H308" stroke="var(--border-subtle)"/><circle cx="70" cy="43" r="5" fill="var(--brand-teal)"/><path d="M86 43H201" stroke="var(--border-subtle)" stroke-width="7" stroke-linecap="round"/>
      <path d="M91 170L124 108L158 170Z" fill="var(--soft-mint)" stroke="var(--brand-teal)" stroke-width="2"/><path d="M124 137V183" stroke="var(--brand-teal)" stroke-width="3"/><ellipse cx="223" cy="171" rx="52" ry="15" fill="var(--soft-mint)"/><path d="M200 155Q215 133 230 155" fill="none" stroke="var(--brand-teal)" stroke-width="3"/><circle cx="266" cy="99" r="21" fill="var(--surface-nudge)"/><path d="M59 221H135M159 221H235" stroke="var(--border-subtle)" stroke-width="7" stroke-linecap="round"/>
      <g transform="translate(250 162) rotate(8)"><rect width="139" height="111" rx="10" fill="var(--soft-mint)" stroke="var(--border-subtle)"/><path d="M24 81H116" stroke="var(--text-primary)"/><rect x="31" y="56" width="17" height="24" rx="3" fill="var(--brand-teal)"/><rect x="59" y="38" width="17" height="42" rx="3" fill="var(--brand-teal)"/><rect x="87" y="23" width="17" height="57" rx="3" fill="var(--brand-teal)"/></g><circle cx="73" cy="271" r="14" fill="var(--surface-lavender)" stroke="var(--border-subtle)"/><rect x="101" y="258" width="27" height="27" rx="5" fill="var(--surface-nudge)" stroke="var(--border-subtle)"/></svg>
      <div class="lab-art-cycle"><span>Notice</span><span>→</span><span>Make</span><span>→</span><span>Reflect</span></div></div>`;
  }
  function mount(target) {
    target.innerHTML = `<div class="academic-home">
      <p class="institution-line">SNOW DAY Learning Lab <span>•</span> Department of Mathematics, Science & Technology <span>•</span> Teachers College, Columbia University</p>
      <section class="lab-hero" aria-labelledby="welcomeTitle"><div><p class="eyebrow">SOCIAL-EMOTIONAL LEARNING THROUGH PLAY & MAKING</p><h1 id="welcomeTitle">Everyday Feelings,<br>Shared Stories</h1><p class="lab-byline">SNOW DAY Learning Lab</p><p class="community-tagline">The ways we care.<br><em>The stories we bring.</em></p><p class="hero-lead">Every family brings knowledge about feelings, care, and belonging. Explore social-emotional learning (SEL) through the stories, languages, routines, and experiences that connect home, community, and school.</p><p class="family-invitation">Start with what your family already knows: a comforting routine, a story you share, or a way you help one another.</p><p class="lab-motto">Observe with care. Support with curiosity.</p><div class="hero-actions"><button class="primary" id="findPath">Find your starting point <span aria-hidden="true">→</span></button><a href="#curriculum" class="lab-link-button">Explore lesson plans</a></div></div>${homeArt()}</section>
      <div class="framework-tags" aria-label="Research framework tags">${["Constructionism", "Universal Design for Learning (UDL)", "Social-Emotional Learning (SEL)", "Inclusive Assistive Technology"].map(t => `<a href="#research">${t}</a>`).join("")}</div>
      <section class="lab-section matcher-layout" aria-labelledby="matcherTitle"><div class="matcher-intro"><p class="eyebrow">A THOUGHTFUL START · ABOUT 2 MINUTES</p><h2 id="matcherTitle">Get to know your classroom or household.</h2><p>Tell us what would help today. We’ll suggest a lesson, a making invitation, and a video to explore together.</p><p class="source-note">Five questions. No names or scores. Answers stay in this open page and are cleared when you reload it.</p><div class="matcher-caption"><span aria-hidden="true">↳</span> Begin with the learner, then shape the environment.</div></div><div id="learningMatcher" class="matcher-panel"></div></section>
      <section class="lab-section sel-section" aria-labelledby="selTitle"><div class="lab-section-heading"><p class="eyebrow">LEARNING IS SOCIAL. FEELINGS BELONG HERE.</p><h2 id="selTitle">What is Social-Emotional Learning?</h2><p>SEL is the ongoing practice of understanding ourselves, caring about others, and making thoughtful choices. Children and adults develop these skills through supportive relationships and everyday experiences. The <a href="https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/" target="_blank" rel="noopener noreferrer">CASEL framework</a> describes five connected areas.</p></div>
      <div class="sel-grid">${[
        ["Self-awareness", "Notice feelings, strengths, and needs.", "“What am I noticing in myself?”"],
        ["Self-management", "Choose strategies for emotions, attention, and goals.", "“What might help me take the next step?”"],
        ["Social awareness", "Consider another person’s perspective and context.", "“What could help my partner feel included?”"],
        ["Relationship skills", "Listen, communicate, collaborate, and ask for support.", "“How can we make this together?”"],
        ["Responsible decision-making", "Think about care, safety, and the effects of a choice.", "“Who could this choice affect?”"]
      ].map(([title, description, prompt], i) => `<article class="sel-card"><span class="lab-number">0${i + 1}</span><h3>${title}</h3><p>${description}</p><p class="sel-prompt">${prompt}</p></article>`).join("")}</div>
      <div class="benefit-grid"><article class="card"><p class="eyebrow">IN SCHOOLS</p><h3>Safety to participate. Confidence to keep trying.</h3><p>Predictable routines, caring relationships, and shared problem-solving can support emotional safety and engagement. Research on SEL programs reports benefits for learning, relationships, and coping; outcomes depend on context and implementation.</p><a href="https://casel.org/fundamentals-of-sel/what-does-the-research-say/" target="_blank" rel="noopener noreferrer">Explore CASEL’s research overview ↗</a></article><article class="card"><p class="eyebrow">AT HOME</p><h3>Small routines. More room for connection.</h3><p>Naming a feeling together, offering a choice, and making time to reconnect can help create a calm, supportive home. Practice asking for help and trying again, so resilience grows alongside a sense of belonging and agency.</p><a href="https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/" target="_blank" rel="noopener noreferrer">Explore family and caregiver partnerships ↗</a></article></div></section>
      <section class="lab-section" aria-labelledby="featuredLessons"><div class="lab-section-heading"><p class="eyebrow">FROM RESEARCH TO THE WORKTABLE</p><h2 id="featuredLessons">Three invitations to make and learn.</h2><p>Complete K–2 plans with SEL intentions, evidence to notice, and accessible participation options.</p></div><div class="cards featured-lessons">${lessonPlans.map((plan, i) => `<article class="card"><div class="lesson-visual visual-${plan.id}" aria-hidden="true"><span>${["◒", "▧", "☼"][i]}</span><small>EXPLORATION 0${i + 1}</small></div><p class="eyebrow">${plan.subject}</p><h3>${plan.title}</h3><p>${plan.summary}</p><div class="tags">${plan.standards.map(s => `<span class="badge">${s[0]}</span>`).join("")}</div><div class="meta-footer"><span>${plan.band} · ${plan.duration}</span><button data-feature-plan="${plan.id}">Read lesson →</button></div></article>`).join("")}</div></section>
      ${buddyFeature()}
      <section class="lab-section research-note roleplay-entry" aria-labelledby="roleplayFeatureTitle"><div><p class="eyebrow">FOR OLDER LEARNERS · GRADES 4–12</p><h2 id="roleplayFeatureTitle">Find the words. Practice the conversation.</h2><p>Explore a frustration about family changes, friendships, school, or something on your mind. Choose a sentence starter, write in your own words, and try a role-play with optional read-aloud support.</p><p class="source-note">Use a real or made-up situation. Your writing stays only in the practice view and clears when you leave.</p></div><a class="lab-link-button" href="#roleplay">Open Write & Role-play →</a></section>
      <section class="lab-section research-note"><div><p class="eyebrow">OPEN TO CURIOSITY. GROUNDED IN RESEARCH.</p><h2>Thoughtful tools. Transparent foundations.</h2><p>Explore the theories behind the design, linked standards, and the boundaries of this research prototype.</p></div><a class="lab-link-button" href="#research">Explore research & methods →</a></section>
      <p class="source-note">Our invitation draws on <a href="https://experts.arizona.edu/en/publications/funds-of-knowledge-for-teaching-in-latino-households-2/" target="_blank" rel="noopener noreferrer">funds of knowledge</a>: learning with the knowledge and skills that families and communities already use in everyday life.</p><p class="source-note institutional-source">Institutional context: <a href="https://www.tc.columbia.edu/mathematics-science-and-technology/" target="_blank" rel="noopener noreferrer">Department of Mathematics, Science & Technology</a> · <a href="https://snowdaylearninglab.org/" target="_blank" rel="noopener noreferrer">Snow Day Learning Lab</a></p>
    </div>`;
    target.querySelector("#findPath").onclick = () => {
      const panel = target.querySelector("#learningMatcher");
      panel.scrollIntoView({ behavior: "instant", block: "center" });
      panel.querySelector("input, button")?.focus({ preventScroll: true });
    };
    target.querySelectorAll("[data-feature-plan]").forEach(b => b.onclick = () => openLesson(b.dataset.featurePlan));
    drawMatcher();
  }
  function drawMatcher(focus = false) {
    const container = document.querySelector("#learningMatcher");
    if (finished) return showMatches(container, focus);
    const q = questions[step];
    container.innerHTML = `<div class="survey-progress"><span>Question ${step + 1} of ${questions.length}</span><span>${Math.round(step / questions.length * 100)}% complete</span></div><progress value="${step}" max="5" aria-label="Questions completed"></progress>
      <form id="matchForm"><fieldset><legend tabindex="-1" id="questionTitle">${q.title}</legend><p class="question-hint" id="questionHint">${q.hint}</p><div class="survey-options">${q.options.map(([value, title, detail]) => `<label class="survey-option"><input type="${q.multiple ? "checkbox" : "radio"}" name="${q.key}" value="${value}" aria-describedby="questionHint" ${q.multiple ? (answers.needs.includes(value) ? "checked" : "") : (answers[q.key] === value ? "checked" : "")}><span><strong>${title}</strong><small>${detail}</small></span></label>`).join("")}</div></fieldset><p class="survey-error" id="surveyError" role="alert"></p><div class="survey-actions"><button type="button" id="surveyBack" ${step === 0 ? "disabled" : ""}>← Back</button><button class="primary" type="submit">${step === 4 ? "Find my matches" : "Continue"} →</button></div></form>`;
    const form = container.querySelector("form");
    // Capture answers on change so Back and navigation preserve unfinished work.
    form.onchange = () => {
      const selected = [...form.querySelectorAll("input:checked")].map(x => x.value);
      answers[q.key] = q.multiple ? selected : selected[0];
      container.querySelector("#surveyError").textContent = "";
    };
    form.onsubmit = event => {
      event.preventDefault();
      const value = answers[q.key];
      if (!value || (Array.isArray(value) && !value.length)) {
        container.querySelector("#surveyError").textContent = q.multiple ? "Choose at least one support, or select Still exploring." : "Choose an option to continue.";
        form.querySelector("input").focus();
        return;
      }
      if (step === 4) finished = true;
      else step++;
      drawMatcher(true);
    };
    container.querySelector("#surveyBack").onclick = () => { if (step > 0) step--; drawMatcher(true); };
    if (focus) container.querySelector("#questionTitle").focus();
  }
  function showMatches(container, focus) {
    const result = match(answers), plan = lessonPlans.find(p => p.id === result.lessonId), alternate = lessonPlans.find(p => p.id === result.alternativeId);
    container.innerHTML = `<div class="survey-progress"><span>YOUR STARTING POINT</span><span>5 of 5 complete</span></div><h3 class="match-heading" id="matchTitle" tabindex="-1">A little making, shaped around your learners.</h3><div class="tags match-summary">${[label("role", answers.role), label("age", answers.age), label("goal", answers.goal), label("time", answers.time), ...answers.needs.map(n => label("needs", n))].map(t => `<span class="badge">${t}</span>`).join("")}</div><p>These are planning suggestions based on your choices. Explore the fit together and adjust as you go.</p>
      <article class="match-resource"><span class="resource-type">01 · MATCHED LESSON</span><h4>${plan.title}</h4><p>${plan.summary}</p><p class="match-reason"><strong>Why this fits:</strong> ${label("goal", answers.goal)} is your focus. We also considered ${answers.needs.map(n => label("needs", n).toLowerCase()).join(", ")}.</p><button id="matchedLesson">Open full lesson →</button></article>
      <article class="match-resource"><span class="resource-type">02 · MAKER STUDIO ACTIVITY</span><h4>${makerTitles[plan.id]}</h4><p>${result.timeNote}</p><p>${result.context}</p><button id="matchedMaker">Start in Maker Studio →</button></article>
      <article class="match-resource"><span class="resource-type">03 · INSTRUCTIONAL VIDEO</span><h4>${result.video.title}</h4><p class="video-provider">${result.video.provider} · ${["middle", "high"].includes(answers.age) ? "For older learners & adults" : "For young learners with an adult"}</p><p>${result.video.purpose}</p><a class="lab-link-button" href="${result.video.url}" target="_blank" rel="noopener noreferrer">Open video resource ↗</a><p class="source-note">Opens the provider’s website. Preview sound, captions, and pace together. ${answers.needs.includes("quiet") ? "For a quieter alternative, use the written steps in the matched lesson with the screen off." : "A written, screen-free alternative is available in the matched lesson."}</p></article>
      <details class="match-details" open><summary>Adapt this invitation</summary><p>${result.ageNote}</p><ul>${result.adaptations.map(t => `<li>${t}</li>`).join("")}</ul></details>
      <details class="match-details"><summary>How these suggestions were matched</summary><p>Your SEL goal contributes three matching points and each specific support contributes two to relevant lesson themes. These rank resources, not learners. Age changes the adaptation and video audience; setting and available time change the activity guidance. No diagnosis or emotional state is inferred.</p><p>Another option: <button class="text-button" id="alternateLesson">${alternate.title} →</button></p></details>
      <div class="survey-actions"><button id="editMatches">← Edit answers</button><button id="resetMatches">Start over</button></div>`;
    container.querySelector("#matchedLesson").onclick = () => openLesson(plan.id);
    container.querySelector("#alternateLesson").onclick = () => openLesson(alternate.id);
    container.querySelector("#matchedMaker").onclick = () => { save("snow-active-lesson", plan.id); location.hash = "studio"; };
    container.querySelector("#editMatches").onclick = () => { finished = false; step = 0; drawMatcher(true); };
    container.querySelector("#resetMatches").onclick = () => { answers = { needs: [] }; finished = false; step = 0; drawMatcher(true); };
    if (focus) container.querySelector("#matchTitle").focus();
  }
  return { mount, frameworkHTML, match };
})();
