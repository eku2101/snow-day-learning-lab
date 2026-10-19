/* Research-informed guided rehearsal; no scoring, recording, or automatic sharing. */
window.TogetherStudio = (() => {
  const data = window.TogetherData;
  const e = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let root = null, session = null, reader = null;
  const state = () => session.state;
  const names = () => state().cast === "buddy" ? [window.BuddyStudio.character().name, "Robin"] : ["Kai", "Remi"];
  const wording = text => text.replaceAll("{a}", names()[0]).replaceAll("{b}", names()[1]);
  function pause() { reader?.pause(); }
  function visibility() { if (document.hidden) pause(); }
  function stop() {
    reader?.stop(); session?.clear(); reader = null; session = null; root = null;
    document.removeEventListener("visibilitychange", visibility);
  }
  function mount(target) {
    root = target; session = data.createSession(location.hash);
    reader = window.BuddyReadAlong.create({ localOnly: true,
      onHighlight(first, last) { root?.querySelectorAll("[data-tp-word]").forEach((w, i) => w.classList.toggle("reading-word", first >= 0 && i >= first && i <= last)); },
      onState(value) { const b = root?.querySelector("#tpPauseAudio"); if (b) { b.disabled = !["reading", "paused"].includes(value); b.textContent = value === "paused" ? "Resume reading" : "Pause reading"; } },
      onMessage(message) { const node = root?.querySelector("#tpVoiceStatus"); if (node) node.textContent = message; },
    });
    document.addEventListener("visibilitychange", visibility); render();
  }
  const learnerMode = () => document.body.classList.contains("child-view");
  const sceneArt = id => {
    const pose = id === "space" ? "pause" : undefined;
    const buddy = state().cast === "buddy" ? window.BuddyStudio.character(pose) : null;
    return window.StudioArt.scene(id, buddy ? { buddySvg: buddy.svg, name: buddy.name } : {});
  };
  function render(focus = false) {
    reader.stop();
    root.innerHTML = `<div class="tp-app">${learnerMode() ? `<div class="learner-header"><span class="buddy-wordmark">Everyday Feelings, Shared Stories<small>SNOW DAY Learning Lab</small></span><div><button id="tpComfort">⚙ Comfort</button><a href="#home">Grown-up view ↗</a></div></div>${window.LearnerNav.markup("together")}` : ""}<div class="tp-heading"><div><p class="eyebrow">PRACTICE TOGETHER · YOUR PACE, YOUR WORDS</p><h1>Little scenes. Real connections.</h1><p>Try a choice. Hear another point of view. Bring your own ways of caring.</p></div></div>
      <p class="tp-permission">Try a made-up scene, in your own way. Write, draw, sign, use AAC, act, or pass.</p>
      <div class="tp-toolbar">${state().scene ? '<button id="tpChooseAgain">← Change activity</button>' : ''}<button id="tpRest">Take a pause</button>${!learnerMode() && !state().scene ? '<a href="#together?mode=learner&band=younger&cast=buddy">Open the simpler learner view →</a>' : ""}</div>
      ${state().scene ? practice() : chooser()}
      <details class="tp-audio"><summary>Optional read-along</summary><p>Read the current scene and example lines with an on-device voice. Sound starts when you choose. Your own writing is not included.</p><div class="tp-actions"><button id="tpRead">Read this part</button><button id="tpPauseAudio" disabled>Pause reading</button></div><p id="tpVoiceStatus" role="status">Word-by-word highlighting. Speed follows Sensory settings. If an on-device voice is unavailable, keep reading on screen.</p><p id="tpReadWords" class="tp-read-words"></p></details>
      <div class="tp-source"><p>Research-informed practice, not a tested intervention. These original scenes use ideas from guided role-play, perspective-taking, and everyday practice. <a href="#research">See sources and evidence limits.</a></p><p>Your writing stays only in this view. Leaving or reloading clears it; nothing is sent to a partner or saved by this activity.</p></div>
      <dialog id="tpPauseDialog" aria-labelledby="tpPauseTitle"><h2 id="tpPauseTitle">There is time.</h2><p>Rest, look away, stretch if you want, or sit with someone you trust. There is no feeling you have to reach.</p><button id="tpReturn" class="primary">Return when I’m ready</button></dialog>
      <dialog id="tpClearDialog" aria-labelledby="tpClearTitle"><h2 id="tpClearTitle">Finish this practice?</h2><p>Your writing will be cleared. It has not been saved or sent.</p><div class="tp-actions"><button id="tpKeep">Keep practicing</button><button id="tpClear" class="primary">Clear & choose another</button></div></dialog></div>`;
    const comfort = root.querySelector("#tpComfort");
    if (comfort) comfort.onclick = () => { pause(); document.querySelector("#settings").showModal(); };
    root.querySelector("#tpRest").onclick = () => { pause(); root.querySelector("#tpPauseDialog").showModal(); };
    root.querySelector("#tpReturn").onclick = () => root.querySelector("#tpPauseDialog").close();
    root.querySelector("#tpKeep").onclick = () => root.querySelector("#tpClearDialog").close();
    root.querySelector("#tpClear").onclick = () => { session.clear(); render(true); };
    root.querySelector("#tpRead").onclick = read;
    root.querySelector("#tpPauseAudio").onclick = () => reader.state === "reading" ? reader.pause() : reader.play();
    if (state().scene) bindPractice(); else bindChooser();
    if (focus) { root.querySelector("#tpTitle").focus({ preventScroll: true }); root.querySelector("#tpTitle").scrollIntoView({ block: "start", behavior: "instant" }); }
  }
  function chooser() {
    return `<section class="tp-panel" aria-labelledby="tpTitle"><p class="eyebrow">MAKE IT FIT YOU</p><h2 id="tpTitle" tabindex="-1">What would you like to try?</h2><details class="tp-customize" ${learnerMode() ? "" : "open"}><summary>Make it fit me · words, characters & partner</summary><div class="tp-setup">
      <label>Words that work for me<select id="tpBand"><option value="younger" ${state().band === "younger" ? "selected" : ""}>Short & simple · younger learners</option><option value="older" ${state().band === "older" ? "selected" : ""}>More detail · older learners</option></select></label>
      <label>Characters<select id="tpCast"><option value="people" ${state().cast === "people" ? "selected" : ""}>Fictional learners · Kai & Remi</option><option value="buddy" ${state().cast === "buddy" ? "selected" : ""}>My buddy & Robin</option></select></label>
      <label>Practice with<select id="tpPartner">${data.partners.map(p => `<option value="${p.id}" ${p.id === state().partner ? "selected" : ""}>${p.label}</option>`).join("")}</select></label>
      <label>Imagine the scene<select id="tpPlace">${[["home", "At home"], ["school", "At school"], ["community", "In my community"]].map(([id, label]) => `<option value="${id}" ${id === state().place ? "selected" : ""}>${label}</option>`).join("")}</select></label></div>
      <p class="tp-setup-notes">Choose the words and characters that work for you.</p></details><div class="tp-scene-grid">${activityCards()}</div></section>`;
  }
  function activityCards() { return data.scenes.map(s => `<button class="tp-scene" data-tp-scene="${s.id}"><span class="tp-card-art" aria-hidden="true">${sceneArt(s.id)}</span><span class="tp-card-copy"><strong>${s.title}</strong><small>${s.skill} →</small></span></button>`).join(""); }
  function bindCards() { root.querySelectorAll("[data-tp-scene]").forEach(button => button.onclick = () => { session.chooseScene(button.dataset.tpScene); render(true); }); }
  function bindChooser() {
    for (const key of ["band", "cast", "partner", "place"]) root.querySelector(`#tp${key[0].toUpperCase() + key.slice(1)}`).onchange = event => { state()[key] = event.target.value; if (key === "cast") { root.querySelector(".tp-scene-grid").innerHTML = activityCards(); bindCards(); } };
    bindCards();
  }
  function practice() {
    const s = data.sceneFor(state().scene), p = data.planFor(s.id, state().plan), guide = data.partners.find(p => p.id === state().partner);
    return `<section class="tp-practice"><div class="tp-context"><span class="badge">${s.skill}</span><span>${s.places[state().place]} · ${guide.label}</span></div><ol class="tp-progress" aria-label="Practice steps">${["Explore a choice", "Try the conversation", "Connect to life"].map((t, i) => `<li ${i === state().stage ? 'aria-current="step"' : ''}><span>${i + 1}</span>${t}</li>`).join("")}</ol>
      <div class="tp-layout"><section class="tp-panel">${state().stage === 0 ? explore(s, p) : state().stage === 1 ? rehearse(s, p) : reflect(s, p)}<div class="tp-actions">${state().stage > 0 ? '<button id="tpBack">← Back</button>' : ''}${state().stage < 2 ? `<button id="tpNext" class="primary" ${!p ? "disabled" : ""}>${state().stage === 0 ? "Try this conversation" : "Connect to everyday life"} →</button>` : '<button id="tpFinish" class="primary">Finish & clear my writing</button>'}</div></section>
      <section class="tp-guide" aria-labelledby="tpGuideTitle"><p class="eyebrow">${guide.id === "solo" ? "YOUR OWN REHEARSAL" : "FOR YOUR PRACTICE PARTNER"}</p><h2 id="tpGuideTitle">${guide.id === "solo" ? "There is more than one way." : "Listen with curiosity."}</h2><p>${guide.before}</p><div class="tp-quote"><strong>A question to try</strong><p>“${guide.prompt}”</p></div><p class="tp-small">Ask before switching roles. You can disagree, change the words, or stop. Real people may respond differently from these examples.</p><details><summary>Why practice this way?</summary><p>Guided role-play offers a way to explore choices and perspectives. Reflection and a small everyday connection are design choices informed by educator resources; benefits from this app have not been measured.</p><a href="https://ggie.berkeley.edu/practice/dear-abby-an-sel-kernels-practice-for-first-grade/" target="_blank" rel="noopener noreferrer">Read GGIE’s role-play practice ↗</a></details></section></div></section>`;
  }
  function explore(s, p) {
    const [a, b] = names();
    return `<p class="eyebrow">A MADE-UP SCENE</p><h2 id="tpTitle" tabindex="-1">${s.title}</h2><div class="tp-scene-intro"><div class="tp-story-art">${sceneArt(s.id)}</div><p>${e(wording(state().band === "younger" ? s.young : s.older))}</p></div>
      <p class="tp-small">These are the characters’ imagined thoughts. In real life, ask someone what they need.</p><div class="tp-perspectives"><div><strong>${e(a)}</strong><p>“${s.a}”</p></div><div><strong>${e(b)}</strong><p>“${s.b}”</p></div></div>
      <fieldset class="tp-plans"><legend>What could they try?</legend><p>Several plans could help. Choose one to explore.</p>${s.plans.map(plan => `<button data-tp-plan="${plan.id}" aria-pressed="${plan.id === state().plan}">${plan.title}<span aria-hidden="true">→</span></button>`).join("")}</fieldset>
      <div id="tpOutcome" class="tp-outcome" role="status">${p ? `<strong>One possible outcome</strong><p>${p.outcome}</p><p>${p.question}</p><small>Try another choice to compare. No points or right-answer labels.</small>` : '<p>A possible outcome will appear when you choose a plan.</p>'}</div>`;
  }
  function rehearse(s, p) {
    const [a, b] = names();
    return `<p class="eyebrow">MODEL → MAKE IT YOURS</p><h2 id="tpTitle" tabindex="-1">Try the conversation.</h2><p>${p.title}. You can read quietly, act with objects, or invite a willing partner.</p><div class="tp-role-note" role="status">${state().swapped ? "Now try the listener’s role; your partner can try the speaker’s." : "Start with the speaker’s role; your partner can try the listener’s."}</div>
      <div class="tp-script"><article><span class="badge">${state().swapped ? "Partner’s turn" : "Your turn"} · Speaker</span><h3>${e(p.id === "listen" ? b : a)}</h3><p>“${state().band === "younger" ? p.young : p.older}”</p></article><article><span class="badge">${state().swapped ? "Your turn" : "Partner’s turn"} · Listener</span><h3>${e(p.id === "listen" ? a : b)}</h3><p>“${p.listener}”</p></article></div><button id="tpSwap">Switch speaker & listener roles</button>
      <label class="tp-writing-label" for="tpLine">How would you say it? <span>Optional · write in any language</span></label><textarea id="tpLine" maxlength="600" rows="3" autocomplete="off" placeholder="Keep the idea, change the words, or start with your own…">${e(state().line)}</textarea><p class="tp-small">Your line stays here while you move between these steps. You choose whether to show it to someone. It is cleared when you leave this view.</p><p>${s.offline}</p>`;
  }
  function reflect(s, p) {
    const guide = data.partners.find(p => p.id === state().partner);
    return `<p class="eyebrow">REFLECT → TRY A SMALL STEP</p><h2 id="tpTitle" tabindex="-1">Bring it into your day.</h2><p>There is nothing to pass. You can finish here or think about a small next step.</p><div class="tp-quote"><strong>Wonder together</strong><p>What mattered to each person? ${p.question} What would you change?</p></div><label class="tp-writing-label" for="tpReflection">A thought or a small next step <span>Optional · writing, drawing off-screen, or thinking are welcome</span></label><textarea id="tpReflection" maxlength="600" rows="3" autocomplete="off" placeholder="In my family, class, or community, one thing that helps is…">${e(state().reflection)}</textarea><div class="tp-transfer"><h3>One everyday invitation</h3><p>${guide.transfer}</p><p>${s.connection}</p><p>Afterward, ask: “What helped? What could we change next time?”</p></div><p class="tp-small">To compare another plan, go Back twice. Your writing stays until you finish, change activity, leave, or reload.</p>`;
  }
  function bindPractice() {
    root.querySelector("#tpChooseAgain").onclick = confirmClear;
    root.querySelectorAll("[data-tp-plan]").forEach(button => button.onclick = () => {
      session.choosePlan(button.dataset.tpPlan);
      const p = data.planFor(state().scene, state().plan);
      root.querySelectorAll("[data-tp-plan]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tpPlan === state().plan));
      root.querySelector("#tpOutcome").innerHTML = `<strong>One possible outcome</strong><p>${p.outcome}</p><p>${p.question}</p><small>Try another choice to compare. No points or right-answer labels.</small>`;
      root.querySelector("#tpNext").disabled = false; reader.stop();
    });
    const next = root.querySelector("#tpNext"), back = root.querySelector("#tpBack"), swap = root.querySelector("#tpSwap");
    if (next) next.onclick = () => { if (session.next()) render(true); };
    if (back) back.onclick = () => { session.back(); render(true); };
    if (swap) swap.onclick = () => { state().swapped = !state().swapped; render(); root.querySelector("#tpSwap").focus(); };
    for (const [id, key] of [["tpLine", "line"], ["tpReflection", "reflection"]]) { const field = root.querySelector(`#${id}`); if (field) field.oninput = event => session.write(key, event.target.value); }
    const finish = root.querySelector("#tpFinish"); if (finish) finish.onclick = confirmClear;
  }
  function confirmClear() { pause(); if (state().line || state().reflection) root.querySelector("#tpClearDialog").showModal(); else { session.clear(); render(true); } }
  function read() {
    const s = data.sceneFor(state().scene), p = s && data.planFor(s.id, state().plan);
    const text = !s ? "Choose a way to practice. Select the words, characters, partner, and place that work for you. Then choose a scene." : state().stage === 0
      ? `${s.title}. ${wording(state().band === "younger" ? s.young : s.older)} ${names()[0]} says: ${s.a} ${names()[1]} says: ${s.b} ${p ? "One possible outcome. " + p.outcome : "What could they try? " + s.plans.map(x => x.title).join(". ")}`
      : state().stage === 1 ? `Try the conversation. Speaker: ${state().band === "younger" ? p.young : p.older} Listener: ${p.listener} You can change these words or pass.`
      : `What mattered to each person? ${p.question} What would you change? ${data.partners.find(x => x.id === state().partner).transfer}`;
    root.querySelector("#tpReadWords").innerHTML = window.BuddyReadAlong.words(text).map(w => `<span data-tp-word>${e(w.text)}</span>`).join(" ");
    const rate = Number(document.querySelector("#speed")?.value) || .8;
    reader.load(text, { mode: "words", rate }); reader.play();
  }
  return { mount, stop, pause };
})();
