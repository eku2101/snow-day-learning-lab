const $ = (s) => document.querySelector(s),
  main = $("#main");
const read = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },
  save = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch { toast("Storage is unavailable. You can keep exploring this page."); }
  },
  escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
let tab = "home",
  running = false,
  timer,
  step = 0,
  cart = read("snow-cart", []),
  posts = read("snow-posts", []),
  feedback = read("snow-feedback", []),
  rules = read("snow-rules", { seconds: 45, taps: 12 }),
  prefs = read("snow-prefs", {
    profile: "light",
    large: false,
    motion: true,
    narrate: false,
    speed: 0.8,
  });
const tabs = [
  ["home", "⌂", "Home"],
  ["curriculum", "▤", "Lesson Plans"],
  ["studio", "⬡", "Maker Studio Workspace"],
  ["companion", "♡", "Buddy Studio"],
  ["roleplay", "✎", "Write & Role-play"],
  ["together", "○", "Practice Together"],
  ["dashboard", "◫", "Observation Dashboard"],
  ["community", "♧", "Community exchange"],
  ["research", "⚑", "Research & rules"],
  ["kits", "□", "Toolkit builder"],
];
const people = [
  {
    name: "Alex",
    initial: "AL",
    task: "Exploring a light-up story",
    seconds: 12,
    taps: 3,
    progress: true,
    gaze: 8,
    tone: "steady",
  },
  {
    name: "Jordan",
    initial: "JO",
    task: "Trying a new circuit path",
    seconds: 31,
    taps: 7,
    progress: true,
    gaze: 19,
    tone: "varied",
  },
  {
    name: "Sam",
    initial: "SA",
    task: "Connecting story blocks",
    seconds: 52,
    taps: 16,
    progress: false,
    gaze: 31,
    tone: "varied",
  },
  {
    name: "Riley",
    initial: "RI",
    task: "Choosing the next challenge",
    seconds: 72,
    taps: 1,
    progress: false,
    gaze: 42,
    tone: "steady",
  },
];
function state(p) {
  if (!p.progress && p.seconds >= rules.seconds && p.taps >= rules.taps)
    return ["Unproductive frustration", "frustration"];
  if (!p.progress && p.seconds > 60 && p.taps < 3)
    return ["Boredom", "boredom"];
  if (p.seconds > 22 || p.taps > 5) return ["Productive struggle", "struggle"];
  return ["Flow state", "flow"];
}
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").style.display = "block";
  setTimeout(() => ($("#toast").style.display = "none"), 3500);
}
function heading(ey, title, desc, action = "") {
  return `<div class="heading"><div><p class="eyebrow">${ey}</p><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
}
function render() {
  window.BuddyStudio?.stop();
  window.RoleplayStudio?.stop();
  window.TogetherStudio?.stop();
  const learnerMode = tab === "companion" || (tab === "together" && new URLSearchParams(location.hash.split("?")[1] || "").get("mode") === "learner");
  document.body.classList.toggle("child-view", learnerMode);
  document.body.classList.toggle("home-view", tab === "home");
  document.querySelectorAll("aside nav button").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
    b.setAttribute("aria-current", b.dataset.tab === tab ? "page" : "false");
  });
  $("#breadcrumb").textContent = tabs.find((x) => x[0] === tab)[2];
  $("#viewContext").textContent = tab === "dashboard" ? "Simulated data only" : "Research & practice";
  ({ home, dashboard, companion, roleplay, together, curriculum, studio, kits, community, research })[
    tab
  ]();
}
$("nav").innerHTML = tabs
  .map(
    ([id, icon, name]) =>
      `<button data-tab="${id}"><span>${icon}</span>${name}</button>`,
  )
  .join("");
function home() { window.LabHome.mount(main); }
function roleplay() { window.RoleplayStudio.mount(main); }
function together() { window.TogetherStudio.mount(main); }
function buddyFeature() {
  return `<section class="buddy-feature" aria-labelledby="buddyFeatureTitle">
    <div class="buddy-feature-art">${window.BuddyStudio.character().svg}</div>
    <div class="buddy-feature-copy">
      <span class="badge">NEW · FOR LITTLE MAKERS</span>
      <h2 id="buddyFeatureTitle">Meet the Buddy Studio.</h2>
      <p>Create a stuffed-animal friend, make coloring pages, and choose stories about feelings, sharing, safe hands, and asking for help. Read along as each spoken word lights up.</p>
      <ul class="buddy-feature-tags" aria-label="Buddy Studio activities">
        <li>♡ Make a buddy</li><li>✎ Color & print</li><li>▷ SEL stories & read-along</li>
      </ul>
      <a class="buddy-launch" href="#companion">Open Buddy Studio <span aria-hidden="true">→</span></a>
      <p class="buddy-feature-note">Big buttons. Optional sound. A quiet moment whenever you need one.</p>
    </div>
  </section>`;
}
function dashboard() {
  const counts = ["flow", "struggle", "frustration", "boredom"].map(
    (s) => people.filter((p) => state(p)[1] === s).length,
  );
  main.innerHTML =
    heading(
      "A SPACE FOR POSSIBILITY",
      "Every learner, a little closer.",
      "Notice the process. Make room for the next small discovery.",
      `<button id="simulate" class="primary">${running ? "Ⅱ Pause session" : "▷ Start simulation"}</button>`,
    ) +
    `<div class="banner"><div><p class="eyebrow">TODAY IN THE MAKER STUDIO</p><h2>Small moments. Meaningful growth.</h2><p>Your learners are building light-up stories. Look for experimentation, help-seeking, and moments of connection.</p></div><div class="sprout" aria-hidden="true">🌱</div></div><div class="stats">${["In flow", "Exploring a challenge", "May need a check-in", "Ready for a new spark"].map((s, i) => `<div class="stat"><span class="stat-icon">${["↗", "⟳", "♡", "✧"][i]}</span><span class="stat-label">${s}</span><div class="value">${counts[i]} <small style="font-size:0.75rem;font-weight:400">learner${counts[i] === 1 ? "" : "s"}</small></div><small>${["Space to keep creating", "Room for productive struggle", "Offer a gentle invitation", "Invite choice and curiosity"][i]}</small></div>`).join("")}</div><div class="two-col"><section class="card"><div class="section-title"><h3>Learning in the moment</h3><small><span class="dot"></span>${running ? "Simulation live" : "Sample session"}</small></div>${people.map((p) => `<div class="learner"><div class="initial">${p.initial}</div><div><b>${p.name}</b><p>${p.task}</p><div class="telemetry">Latency ${p.seconds}s · ${p.taps} taps/min · Gaze drift ${p.gaze}% · Tone ${p.tone}</div></div><span class="badge ${state(p)[1]}">${state(p)[0]}</span></div>`).join("")}<p style="font-size:0.6875rem">Illustrative hypotheses, not emotion detection. Confirm with the learner; gaze and voice are context only.</p></section><section class="card"><div class="section-title"><h3>Gentle next steps</h3><span>✧</span></div><div class="recommendation"><span class="badge frustration">CHECK IN WITH SAM</span><p>Repeated interactions without a change. Offer a pause, a different material, or a little help.</p><button class="text-button" id="checkin">Record a supportive check-in →</button></div><div class="recommendation recommendation-secondary"><span class="badge boredom">INVITE RILEY TO CHOOSE</span><p>Try a new story prompt or let the learner lead the next challenge.</p><button class="text-button" id="browse">Explore lesson ideas →</button></div><p style="font-size:0.6875rem">No ranking. No punitive scores. Just invitations to support.</p></section></div><div class="card bottom-card"><div><p class="eyebrow">BUILT ON CURIOSITY, GROUNDED IN RESEARCH</p><h3>See the learning behind the making.</h3><p>Evidence-centered design connects meaningful actions with thoughtful support.</p></div><button id="rulesLink">Explore the research ↗</button></div>`;
  $("#simulate").onclick = () => {
    running = !running;
    clearInterval(timer);
    if (running)
      timer = setInterval(() => {
        people.forEach((p) => {
          p.seconds = Math.max(
            2,
            p.seconds + Math.floor(Math.random() * 15) - 7,
          );
          p.taps = Math.max(0, p.taps + Math.floor(Math.random() * 5) - 2);
        });
        if (tab === "dashboard") dashboard();
      }, 4000);
    dashboard();
  };
  $("#checkin").onclick = () => {
    const log = read("snow-checkins", []);
    log.push({ learner: "Sam", time: new Date().toISOString() });
    save("snow-checkins", log);
    toast("Supportive check-in recorded on this device.");
  };
  $("#browse").onclick = () => {
    location.hash = "curriculum";
  };
  $("#rulesLink").onclick = () => {
    location.hash = "research";
  };
}
function curriculum() {
  renderLessonLibrary();
}
function speak(t) {
  if (prefs.narrate && "speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.rate = +prefs.speed;
    speechSynthesis.speak(u);
  }
}
function companion() {
  window.BuddyStudio.mount(main);
}
const products = [
  [
    "Emotion Dial",
    "◉",
    18,
    "A tactile invitation to express how a moment feels.",
  ],
  [
    "Tactile Story Blocks",
    "▧",
    28,
    "Texture-rich pieces for stories in every language.",
  ],
  [
    "Smart Circuit Tags",
    "⚡",
    24,
    "Bring a story to life with simple circuit connections.",
  ],
];
function kits() {
  main.innerHTML =
    heading(
      "HANDS-ON POSSIBILITIES",
      "Build a kit. Open a possibility.",
      "Modular materials for classroom and home exploration.",
    ) +
    `<div class="cards">${products.map((x, i) => `<article class="card"><div class="art">${x[1]}</div><h2>${x[0]}</h2><p>${x[3]}</p><b>$${x[2]} · Sample pricing</b><button data-add="${i}">+ Add to kit</button></article>`).join("")}</div><section class="card" style="margin-top:24px"><h2>Your toolkit</h2><div id="cart"></div><p>Demo order management. No payment, shipment, or real purchase takes place.</p><button class="primary" id="order">Create demo order</button><div id="orders"></div></section>`;
  document.querySelectorAll("[data-add]").forEach(
    (b) =>
      (b.onclick = () => {
        const id = +b.dataset.add;
        const item = cart.find((x) => x.id === id);
        if (item) item.qty++;
        else cart.push({ id, qty: 1 });
        save("snow-cart", cart);
        drawCart();
      }),
  );
  $("#order").onclick = () => {
    if (!cart.length) return toast("Add a component to your toolkit first.");
    const orders = read("snow-orders", []);
    orders.unshift({
      id: "DEMO-" + Date.now().toString().slice(-6),
      items: cart,
      total: cart.reduce((t, x) => t + products[x.id][2] * x.qty, 0),
    });
    save("snow-orders", orders);
    cart = [];
    save("snow-cart", cart);
    drawCart();
    drawOrders();
    toast("Demo order saved. No purchase or shipment created.");
  };
  drawCart();
  drawOrders();
}
function drawCart() {
  $("#cart").innerHTML = cart.length
    ? cart
        .map(
          (x) =>
            `<div class="cart-row"><span>${products[x.id][0]} × ${x.qty}</span><span>$${products[x.id][2] * x.qty} <button data-remove="${x.id}" aria-label="Remove one ${products[x.id][0]}">−</button></span></div>`,
        )
        .join("") +
      `<p><b>Total $${cart.reduce((t, x) => t + products[x.id][2] * x.qty, 0)}</b></p>`
    : "<p>Your kit is waiting for its first piece.</p>";
  document.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        cart = cart
          .map((x) =>
            x.id === +b.dataset.remove ? { ...x, qty: x.qty - 1 } : x,
          )
          .filter((x) => x.qty > 0);
        save("snow-cart", cart);
        drawCart();
      }),
  );
}
function drawOrders() {
  $("#orders").innerHTML = read("snow-orders", [])
    .map((x) => `<p>${x.id} · $${x.total} · Demo request recorded</p>`)
    .join("");
}
function community() {
  main.innerHTML =
    heading(
      "GOOD IDEAS GROW TOGETHER",
      "A place to share what works.",
      "Classroom modifications and parent perspectives, side by side.",
    ) +
    `<div class="two-col"><section class="card"><h2>Educator exchange</h2><p class="badge">LOCAL DEMO · POSTS STAY ON THIS DEVICE</p><article class="recommendation"><h3>A quiet way to share a story</h3><p>Sample educator post · Offer a photo of the build or a pointing response when a spoken presentation feels overwhelming.</p></article><div id="posts"></div><form id="postForm"><label>Your classroom modification<textarea name="body" required maxlength="1500" placeholder="What helped your learners?"></textarea></label><button class="primary">Share locally</button></form></section><section class="card"><h2>Parent voice</h2><p>What made home exploration more comfortable?</p><form id="feedbackForm"><label>Lesson<select name="lesson">${lessonPlans.map((x) => `<option>${x.title}</option>`).join("")}</select></label><label>Sensory adaptation or feedback<textarea name="body" required maxlength="1500" placeholder="Share a support, preference, or idea."></textarea></label><button class="primary">Save feedback locally</button></form><p id="feedbackCount"></p><p style="font-size:0.6875rem">Use anonymous examples. This prototype has no shared forum or parent accounts.</p></section></div>`;
  const draw = () => {
    $("#posts").innerHTML = posts
      .map(
        (x) =>
          `<article class="recommendation"><h3>Community contribution</h3><p>${escape(x)}</p></article>`,
      )
      .join("");
    $("#feedbackCount").textContent =
      feedback.length + " home-use reflection(s) saved on this device.";
  };
  $("#postForm").onsubmit = (e) => {
    e.preventDefault();
    posts.unshift(e.target.body.value.trim());
    save("snow-posts", posts);
    e.target.reset();
    draw();
    toast("Your modification is saved locally.");
  };
  $("#feedbackForm").onsubmit = (e) => {
    e.preventDefault();
    feedback.push({
      lesson: e.target.lesson.value,
      body: e.target.body.value.trim(),
    });
    save("snow-feedback", feedback);
    e.target.reset();
    draw();
    toast("Thank you. Your reflection is saved locally.");
  };
  draw();
}
function research() {
  main.innerHTML =
    heading(
      "OBSERVATION WITH INTENTION",
      "Make the evidence visible.",
      "Research framing and transparent, editable prototype rules.",
    ) +
    window.LabHome.frameworkHTML() +
    window.ResearchNotes.html() +
    `<div class="research-grid"><article class="card"><p class="eyebrow">01 · EVIDENCE-CENTERED DESIGN</p><h3>Stealth assessment</h3><p>Competency: self-regulation and flexible thinking. Evidence: iteration, help-seeking, and pauses. Task: open-ended circuit storytelling.</p></article><article class="card"><p class="eyebrow">02 · PLAYFUL TESTING</p><h3>A dashboard for dialogue</h3><p>The supplied Holbert research framing informs a process-focused dashboard. Teacher and learner co-design remains a future research activity.</p></article><article class="card"><p class="eyebrow">03 · MULTIMODAL ANALYTICS</p><h3>Context before conclusions</h3><p>Simulated pacing, gaze drift, and voice tone illustrate possible signals. No camera, microphone, or hardware input is collected.</p></article></div><section class="card"><h2>ECD rule builder</h2><p>Adjust the illustrative check-in hypothesis. These rules are not validated measures of SEL or internal emotional states.</p><form id="ruleForm"><label>Time without a state change (seconds)<br><input name="seconds" type="number" min="5" max="300" required value="${rules.seconds}"></label><label>Rapid tapping threshold (taps per minute)<br><input name="taps" type="number" min="3" max="120" required value="${rules.taps}"></label><p>When both thresholds are met and no task progress occurs, suggest a supportive check-in. Gaze and tone never trigger the rule.</p><button class="primary">Save rule</button> <button type="button" id="resetRules">Reset defaults</button></form><p id="ruleSummary"></p><details><summary>Inspect all prototype decision rules</summary><p>Priority 1: no progress + saved latency and tap thresholds → unproductive frustration hypothesis.<br>Priority 2: no progress + latency over 60s + fewer than 3 taps/min → boredom hypothesis.<br>Priority 3: latency over 22s or more than 5 taps/min → productive struggle hypothesis.<br>Otherwise → flow hypothesis.</p><p>Rules are illustrative and can misinterpret disability-related movement, communication differences, or a deliberate pause. Teacher observation and learner choice guide support.</p></details></section>`;
  $("#ruleForm").onsubmit = (e) => {
    e.preventDefault();
    rules = { seconds: +e.target.seconds.value, taps: +e.target.taps.value };
    save("snow-rules", rules);
    $("#ruleSummary").textContent =
      `Saved: ${rules.seconds}s and ${rules.taps} taps/min without progress.`;
    toast("Rule saved. Dashboard hypotheses now use these thresholds.");
  };
  $("#resetRules").onclick = () => {
    rules = { seconds: 45, taps: 12 };
    save("snow-rules", rules);
    research();
  };
}

// Migrate previously saved profiles without losing accessibility preferences.
prefs.profile =
  { calm: "neutral", bright: "light", contrast: "dark" }[prefs.profile] ||
  prefs.profile ||
  "light";
prefs.fontScale = ["100", "115", "130"].includes(String(prefs.fontScale))
  ? String(prefs.fontScale)
  : "100";
function applyPrefs() {
  document.documentElement.dataset.theme = prefs.profile;
  document.documentElement.style.fontSize = `${(16 * Number(prefs.fontScale)) / 100}px`;
  document.body.classList.toggle("large", prefs.large);
  document.body.classList.toggle(
    "reduced",
    prefs.motion || prefs.profile === "neutral",
  );
}
$("#settingsButton").onclick = () => {
  window.RoleplayStudio?.pause();
  window.TogetherStudio?.pause();
  $("#settings").showModal();
};
["profile", "fontScale", "large", "motion", "narrate", "speed"].forEach(
  (id) => {
    const control = $("#" + id);
    if (control.type === "checkbox") control.checked = prefs[id];
    else control.value = prefs[id];
    control.onchange = () => {
      prefs[id] = control.type === "checkbox" ? control.checked : control.value;
      save("snow-prefs", prefs);
      applyPrefs();
      $("#settingsStatus").textContent =
        `Saved: ${$("#profile").selectedOptions[0].textContent}, text ${prefs.fontScale}%.`;
    };
  },
);
function navigate(id, focus = true) {
  // Only fixed practice options go in the hash; learner writing never does.
  id = id.split("?")[0];
  tab = tabs.some((item) => item[0] === id) ? id : "home";
  render();
  if (focus) {
    main.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior:
        prefs.motion || prefs.profile === "neutral" ? "instant" : "smooth",
    });
  }
}
$("nav").onclick = (event) => {
  const button = event.target.closest("[data-tab]");
  if (button) location.hash = button.dataset.tab;
};
window.addEventListener("hashchange", () => {
  if (location.hash === "#main") {
    main.focus();
    return;
  }
  navigate(location.hash.slice(1));
});
applyPrefs();
navigate(location.hash.slice(1), false);
