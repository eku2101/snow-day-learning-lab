/* Private-by-default writing practice: transient memory only, no recording or submission. */
window.RoleplayStudio = (() => {
  const data = window.RoleplayData;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  let root = null, reader = null, active = false, scenario = null;
  let band = "middle", partner = "A trusted adult", step = 0, furthest = 0, reviewing = false;
  let drafts = [], lines = [], selectedVoice = "", readingMode = "smooth", clearAction = null;
  const resetWriting = () => {
    step = 0; furthest = 0; reviewing = false;
    drafts = data.steps.map(() => ({ starter: 0, values: ["", "", ""] }));
    lines = [null, null, null];
  };
  const chosenPrefix = () => data.starters(scenario, band, step)[drafts[step].starter];
  const draftText = () => data.compose(chosenPrefix(), drafts[step].values[drafts[step].starter]);
  const firstPrompt = () => scenario.opening;
  const reply = i => i === 0 ? scenario.reply : i === 1
    ? "What is one thing you want to ask for, or one next step you would like help with?"
    : "Thank you for telling me what you want to ask for. We can talk about what is possible together.";
  function pause() { reader?.pause(); }
  function onVisibility() { if (document.hidden) pause(); }
  function stop() {
    reader?.stop();
    reader = null; active = false; scenario = null; clearAction = null; resetWriting();
    document.removeEventListener("visibilitychange", onVisibility);
    window.speechSynthesis?.removeEventListener("voiceschanged", updateVoices);
    root = null;
  }
  function mount(target) {
    root = target; active = true; scenario = null; resetWriting();
    reader = window.BuddyReadAlong.create({
      localOnly: true,
      onHighlight(first, last) {
        root?.querySelectorAll("[data-rp-word]").forEach((word, i) => word.classList.toggle("reading-word", first >= 0 && i >= first && i <= last));
      },
      onState(state) {
        const button = root?.querySelector("#rpPause");
        if (!button) return;
        button.disabled = !["reading", "paused"].includes(state);
        button.textContent = state === "paused" ? "Resume reading" : "Pause reading";
      },
      onMessage(message) {
        const node = root?.querySelector("#rpVoiceStatus");
        if (node) node.textContent = message.startsWith("You reached the end") ? "Reading finished. You choose what happens next." : message;
      },
    });
    document.addEventListener("visibilitychange", onVisibility);
    window.speechSynthesis?.addEventListener("voiceschanged", updateVoices);
    render();
  }
  function focus(selector) { root.querySelector(selector)?.focus({ preventScroll: true }); }
  function render() {
    reader.stop();
    root.innerHTML = `<div class="roleplay-app">
      <div class="rp-heading"><div><p class="eyebrow">WRITE & ROLE-PLAY · GRADES 4–12</p><h1>Say it your way.</h1><p>Put a frustration into words. Practice a conversation. Start with the experiences, languages, and ways of caring that are yours.</p></div><span class="rp-pencil" aria-hidden="true">✎</span></div>
      <div class="rp-privacy"><strong>Your words, your choice.</strong> Write a little, use a made-up situation, or skip a prompt. This site keeps your writing only in this view; leaving or reloading clears it. Nothing is submitted to anyone. No microphone is used.</div>
      <div class="rp-toolbar">${scenario ? `<button id="rpChange">← Choose a different practice</button><button id="rpClear">Clear my writing</button>` : ""}<button id="rpRest">Take a pause</button></div>
      ${scenario ? practice() : chooser()}
      <details class="rp-audio"><summary>Optional read-aloud</summary><p>Write first, then listen if it helps. Reading uses an on-device voice; your writing is never sent to an online voice by this feature.</p><div class="rp-voice-options"><label>Reading voice<select id="rpVoice"></select></label><label>Read-along style<select id="rpReadingMode"><option value="smooth" ${readingMode === "smooth" ? "selected" : ""}>Smooth sentences</option><option value="words" ${readingMode === "words" ? "selected" : ""}>Word by word</option></select></label></div><p class="buddy-small">Smooth mode highlights words when the voice supports it, otherwise a sentence. Word by word highlights every spoken word. Speed follows Sensory settings.</p><div class="rp-buttons"><button id="rpReadPrompt">Read the prompt</button><button id="rpReadDraft" ${!scenario || reviewing || !draftText() ? "disabled" : ""}>Read my draft aloud</button><button id="rpReadScript" ${!lines.some(Boolean) ? "disabled" : ""}>Read my practice aloud</button><button id="rpPause" disabled>Pause reading</button></div><p id="rpVoiceStatus" role="status">Sound starts only when you choose a read-aloud button.</p><p id="rpReadWords" class="rp-read-words"></p></details>
      <details class="rp-grownup"><summary>For families and educators</summary><p>These are scripted writing invitations, not an assessment or counseling conversation. Let the learner choose their topic, language, and amount of detail. No one needs to share a personal experience with a class. A fictional example is always welcome.</p><p>For a real conversation, ask whether the learner wants listening, practical help, or time. These practice responses model a supportive listener; real responses may differ. If a conversation feels unsafe, the learner can stop and seek another trusted adult.</p><p>Family-change framing draws on the American Academy of Pediatrics’ <a href="https://www.healthychildren.org/English/family-life/family-dynamics/types-of-families/pages/Adjusting-to-Divorce.aspx" target="_blank" rel="noopener noreferrer">guidance on separation and divorce</a>.</p></details>
      <dialog id="rpConfirm" aria-labelledby="rpConfirmTitle"><h2 id="rpConfirmTitle">Clear this writing?</h2><p>The words in this practice will disappear. They have not been saved or sent.</p><div class="rp-buttons"><button id="rpKeep">Keep writing</button><button class="primary" id="rpConfirmClear">Clear and continue</button></div></dialog>
      <dialog id="rpPauseDialog" aria-labelledby="rpPauseTitle"><h2 id="rpPauseTitle">There is no hurry.</h2><p>You can rest, look away from the screen, or ask someone you trust to sit with you. You do not have to find all the words today.</p><p>Your writing will stay here while this pause is open.</p><button class="primary" id="rpReturn">Return when I’m ready</button></dialog>
    </div>`;
    root.querySelector("#rpRest").onclick = () => { pause(); root.querySelector("#rpPauseDialog").showModal(); };
    root.querySelector("#rpReturn").onclick = () => root.querySelector("#rpPauseDialog").close();
    root.querySelector("#rpKeep").onclick = () => root.querySelector("#rpConfirm").close();
    root.querySelector("#rpConfirmClear").onclick = () => {
      root.querySelector("#rpConfirm").close();
      clearAction?.(); clearAction = null;
    };
    if (scenario) bindPractice(); else bindChooser();
    root.querySelector("#rpReadPrompt").onclick = () => readText(scenario ? (reviewing ? "Read through your practice. You can edit your words, show this screen to someone you trust, or finish and clear it." : [firstPrompt(), scenario.reply, reply(1)][step]) : "Choose a topic and the writing support that feels right for you. You can practice with a made-up situation.");
    root.querySelector("#rpReadDraft").onclick = () => readText(draftText());
    root.querySelector("#rpReadScript").onclick = () => readText(conversationText());
    root.querySelector("#rpPause").onclick = () => reader.state === "reading" ? reader.pause() : reader.play();
    root.querySelector("#rpReadingMode").onchange = event => { reader.stop(); readingMode = event.target.value; };
    root.querySelector("#rpVoice").onchange = event => { reader.stop(); selectedVoice = event.target.value; };
    updateVoices();
  }
  function chooser() {
    return `<section class="rp-choose" aria-labelledby="rpChooseTitle"><h2 id="rpChooseTitle" tabindex="-1">What would you like to practice?</h2><p>No need to explain why you choose a topic.</p><div class="rp-setup"><label>Writing support<select id="rpBand">${data.bands.map(([id, title, help]) => `<option value="${id}" ${band === id ? "selected" : ""}>${title} · ${help}</option>`).join("")}</select></label><label>Imagine talking with<select id="rpPartner">${["A trusted adult", "A teacher or counselor", "A friend"].map(label => `<option ${partner === label ? "selected" : ""}>${label}</option>`).join("")}</select></label></div><p class="rp-small">Choose any writing support that works for you. This is not an age check.</p><div class="rp-topic-grid">${data.scenarios.map(s => `<button class="rp-topic" data-rp-topic="${s.id}"><span aria-hidden="true">${s.icon}</span><strong>${s.title}</strong><small>${s.summary}</small></button>`).join("")}</div></section>`;
  }
  function bindChooser() {
    root.querySelector("#rpBand").onchange = event => { band = event.target.value; };
    root.querySelector("#rpPartner").onchange = event => { partner = event.target.value; };
    root.querySelectorAll("[data-rp-topic]").forEach(button => button.onclick = () => {
      scenario = data.scenarios.find(s => s.id === button.dataset.rpTopic);
      resetWriting(); render(); focus("#rpStepTitle");
      root.querySelector(".rp-workspace").scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function practice() {
    return `<section class="rp-practice" aria-label="${esc(scenario.title)}"><div class="rp-context"><p class="eyebrow">${data.bands.find(b => b[0] === band)[1]} · ${esc(partner)}</p><h2>${scenario.title}</h2><p>${scenario.reminder}</p></div><nav class="rp-steps" aria-label="Writing steps">${data.steps.map((label,i) => `<button data-rp-step="${i}" ${i > furthest ? "disabled" : ""} aria-current="${!reviewing && i === step ? "step" : "false"}"><span>${i+1}</span>${label}</button>`).join("")}</nav><div class="rp-workspace">${reviewing ? review() : editor()}<section class="rp-conversation" aria-labelledby="rpConversationTitle"><p class="eyebrow">A PRACTICE, AT YOUR PACE</p><h2 id="rpConversationTitle">Try the conversation.</h2><p class="rp-small">The partner’s words are examples of a supportive response. This is a script, and no person is receiving your writing.</p><div id="rpTranscript">${transcript()}</div></section></div></section>`;
  }
  function editor() {
    const starters = data.starters(scenario, band, step);
    const draft = drafts[step];
    return `<section class="rp-editor" aria-labelledby="rpStepTitle"><p class="eyebrow">INVITATION ${step+1} OF 3</p><h2 id="rpStepTitle" tabindex="-1">${data.steps[step]}</h2><p>${["What would you like someone to understand?", "Think of a routine, person, place, or way of caring that works for you.", "A small, specific request can be a place to begin."][step]}</p><label for="rpStarter">Choose a sentence starter</label><select id="rpStarter">${starters.map((prefix,i) => `<option value="${i}" ${draft.starter === i ? "selected" : ""}>${prefix ? esc(prefix) + " …" : "Write entirely in my own words"}</option>`).join("")}</select><div class="rp-writing-frame"><p class="rp-prefix">${esc(chosenPrefix()) || "Your words, from the beginning:"}</p><label for="rpDraft">${chosenPrefix() ? "Fill in the blank with your thought" : "What would you like to write?"}</label><textarea id="rpDraft" rows="5" maxlength="600" autocomplete="off" spellcheck="true" aria-describedby="rpDraftHelp rpCount" placeholder="A few words are enough. Write in any language that feels like yours.">${esc(draft.values[draft.starter])}</textarea><div class="rp-writing-meta"><p id="rpDraftHelp">Try writing your own words first. Spelling does not need to be perfect.</p><span id="rpCount">${draft.values[draft.starter].length}/600</span></div></div><details class="rp-ideas"><summary>I would like an idea to get started</summary><p>These are possibilities, not guesses about you. Edit them to sound like you. Choosing one adds it to your writing.</p><div class="rp-idea-buttons">${scenario.ideas[step].map((idea,i) => `<button data-rp-idea="${i}">${esc(idea)}</button>`).join("")}</div></details><div class="rp-draft-preview"><h3>My sentence</h3><p id="rpPreview">${esc(draftText()) || "Your sentence will appear here as you write."}</p></div><p id="rpDraftStatus" class="rp-small" role="status"></p><div class="rp-buttons"><button class="primary" id="rpAdd" ${!draftText() ? "disabled" : ""}>${lines[step] ? "Update my line & continue" : "Add my line to the practice"}</button><button id="rpSkip">${step === 2 ? "Review what I have" : "Skip this for now"}</button></div></section>`;
  }
  function transcript() {
    let html = `<div class="rp-bubble rp-partner"><span>Practice partner · ${esc(partner)}</span><p>${esc(firstPrompt())}</p></div>`;
    lines.forEach((line, i) => {
      if (!line) return;
      html += `<div class="rp-bubble rp-mine"><span>My words</span><p>${esc(line)}</p><button data-rp-edit="${i}">Edit this line</button></div><div class="rp-bubble rp-partner"><span>Example response</span><p>${esc(reply(i))}</p></div>`;
    });
    if (!lines.some(Boolean)) html += '<p class="rp-empty">When you choose “Add my line,” your words will join this practice here.</p>';
    return html;
  }
  function review() {
    return `<section class="rp-editor rp-review" aria-labelledby="rpStepTitle"><p class="eyebrow">YOUR WORDS, TO USE YOUR WAY</p><h2 id="rpStepTitle" tabindex="-1">Read it back. Make it yours.</h2><p>${lines.some(Boolean) ? "You have put some thoughts into words. You can change any line, read your practice aloud, or show this screen to someone you trust." : "You can think without writing anything down. Return to a prompt if you want, or finish here."}</p><p>You decide whether to use this in a real conversation. A listener may respond differently. You can pause, write a note, or ask another trusted adult for support.</p><div class="rp-buttons"><button id="rpEditMore">Return to my writing</button><button class="primary" id="rpFinish">Finish & clear my writing</button></div><p class="rp-small">Nothing is automatically shared with family, school, or a community forum.</p></section>`;
  }
  function confirmClear(action) {
    pause(); clearAction = action;
    root.querySelector("#rpConfirm").showModal();
  }
  function bindPractice() {
    const reset = () => { reader.stop(); resetWriting(); scenario = null; render(); focus("#rpChooseTitle"); };
    root.querySelector("#rpChange").onclick = () => {
      if (drafts.some(d => d.values.some(v => v.trim())) || lines.some(Boolean)) confirmClear(reset);
      else reset();
    };
    root.querySelector("#rpClear").onclick = () => confirmClear(() => { resetWriting(); render(); focus("#rpStepTitle"); });
    root.querySelectorAll("[data-rp-step], [data-rp-edit]").forEach(button => button.onclick = () => {
      step = Number(button.dataset.rpStep ?? button.dataset.rpEdit); reviewing = false; render(); focus("#rpStepTitle");
    });
    if (reviewing) {
      root.querySelector("#rpEditMore").onclick = () => { reviewing = false; step = 0; render(); focus("#rpStepTitle"); };
      root.querySelector("#rpFinish").onclick = () => confirmClear(reset);
      return;
    }
    root.querySelector("#rpStarter").onchange = event => {
      drafts[step].starter = Number(event.target.value); render(); focus("#rpDraft");
    };
    const input = root.querySelector("#rpDraft");
    input.oninput = updateDraft;
    root.querySelectorAll("[data-rp-idea]").forEach(button => button.onclick = () => {
      const idea = scenario.ideas[step][Number(button.dataset.rpIdea)];
      const addition = (input.value.trim() ? " " : "") + idea;
      if (input.value.length + addition.length > input.maxLength) {
        root.querySelector("#rpDraftStatus").textContent = "There is not enough room to add that idea. You can edit your own words instead.";
        return;
      }
      input.value += addition; updateDraft(); focus("#rpDraft");
      root.querySelector("#rpDraftStatus").textContent = "Idea added. Change any words so they sound like you.";
    });
    const advance = () => {
      if (step === 2) reviewing = true;
      else { step++; furthest = Math.max(furthest, step); }
      render(); focus("#rpStepTitle");
      root.querySelector(".rp-workspace").scrollIntoView({ block: "start", behavior: "instant" });
    };
    root.querySelector("#rpAdd").onclick = () => { if (!draftText()) return; lines[step] = draftText(); advance(); };
    root.querySelector("#rpSkip").onclick = advance;
  }
  function updateDraft() {
    reader.stop();
    const input = root.querySelector("#rpDraft");
    drafts[step].values[drafts[step].starter] = input.value;
    root.querySelector("#rpPreview").textContent = draftText() || "Your sentence will appear here as you write.";
    root.querySelector("#rpCount").textContent = `${input.value.length}/600`;
    root.querySelector("#rpAdd").disabled = !draftText();
    root.querySelector("#rpReadDraft").disabled = !draftText();
    root.querySelector("#rpReadWords").textContent = "";
  }
  function updateVoices() {
    if (!active || !root) return;
    const select = root.querySelector("#rpVoice");
    const voices = window.speechSynthesis?.getVoices().filter(voice => voice.localService) || [];
    if (!voices.some(voice => voice.voiceURI === selectedVoice))
      selectedVoice = (voices.find(voice => /^en[-_]/i.test(voice.lang)) || voices[0])?.voiceURI || "";
    select.innerHTML = voices.length ? voices.map(voice => `<option value="${esc(voice.voiceURI)}" ${voice.voiceURI === selectedVoice ? "selected" : ""}>${esc(voice.name)} · ${esc(voice.lang)}</option>`).join("") : '<option value="">No on-device voice available yet</option>';
  }
  function readText(text) {
    if (!text) return;
    root.querySelector(".rp-audio").open = true;
    root.querySelector("#rpReadWords").innerHTML = window.BuddyReadAlong.words(text).map(word => `<span data-rp-word>${esc(word.text)}</span>`).join(" ");
    reader.load(text, { mode: readingMode, voiceURI: selectedVoice, rate: document.querySelector("#speed")?.value || .8 });
    reader.play();
  }
  function conversationText() {
    return ["Practice partner. " + firstPrompt(), ...lines.flatMap((line, i) => line ? ["My words. " + line, "Example response. " + reply(i)] : [])].join("\n");
  }
  return { mount, stop, pause };
})();
