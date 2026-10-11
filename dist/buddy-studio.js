/* A browser-local stuffed-animal maker, coloring book, and animated story studio. */
window.BuddyStudio = (() => {
  const animals = [
    ["bear", "Bear"],
    ["bunny", "Bunny"],
    ["cat", "Kitten"],
    ["fox", "Fox"],
  ];
  const colors = [
    ["lavender", "#c8b7df"],
    ["peach", "#efbd9f"],
    ["mint", "#a9cfb8"],
    ["honey", "#e5c47c"],
    ["sky", "#abc9df"],
    ["rose", "#e7b7c7"],
  ];
  const paints = [
    ...colors,
    ["leaf", "#7aaf80"],
    ["berry", "#c67b8f"],
    ["white", "#ffffff"],
  ];
  const patches = [
    ["heart", "Heart"],
    ["star", "Star"],
    ["moon", "Moon"],
  ];
  const settingsKey = "snow-buddy-v1";
  const e = (text) =>
    String(text).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  function load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }
  const stored = load(settingsKey, {});
  const buddy = {
    animal: animals.some(([id]) => id === stored.animal)
      ? stored.animal
      : "bear",
    color: colors.some(([, value]) => value === stored.color)
      ? stored.color
      : colors[0][1],
    patch: patches.some(([id]) => id === stored.patch) ? stored.patch : "heart",
    name: typeof stored.name === "string" ? stored.name.slice(0, 18) : "Mallow",
  };
  const stories = [
    {
      id: "cloud",
      title: "The little cloud garden",
      icon: "☁",
      theme: "garden",
      skill: "A soft breath, at your own pace.",
      scenes: [
        [
          "A busy little morning",
          "{name} has lots of fluttery feelings. We can slow down together.",
          "You can just watch, too.",
        ],
        [
          "Hello, little flower",
          "{name} notices a flower. If you like, take one comfortable breath in.",
          "No big breath needed.",
        ],
        [
          "A cloud floats by",
          "{name} lets the breath out gently, like a cloud drifting away.",
          "Let your body choose its pace.",
        ],
        [
          "A place to stay",
          "{name} rests beside the flowers. Every feeling is welcome here.",
          "Rest, watch again, or ask a grown-up to sit with you.",
        ],
      ],
    },
    {
      id: "puddle",
      title: "Paws by the peaceful pond",
      icon: "≈",
      theme: "pond",
      skill: "Feel your feet. Let your shoulders soften.",
      scenes: [
        [
          "Wiggly paws",
          "{name} feels wiggly after a big day. There is time for a little pause.",
          "Sitting or standing is okay.",
        ],
        [
          "Hello, ground",
          "{name} notices the ground. If comfortable, feel your feet or your seat.",
          "You can choose any comfy position.",
        ],
        [
          "Soft little shoulders",
          "{name} lifts their shoulders a little, then lets them soften.",
          "Only move if it feels good to you.",
        ],
        [
          "Ripples settle",
          "{name} watches a ripple. You do not have to do anything right now.",
          "Your body can rest in its own way.",
        ],
      ],
    },
    {
      id: "cozy",
      title: "The cozy blanket hideaway",
      icon: "⌂",
      theme: "stars",
      skill: "Choose comfort and ask for a little help.",
      scenes: [
        [
          "A lot to notice",
          "The day feels a little too busy for {name}. A quiet place might help.",
          "It is okay to want less noise or light.",
        ],
        [
          "Make a cozy space",
          "{name} chooses a soft spot. You can choose what feels comfortable.",
          "A cushion, a quiet corner, or some space.",
        ],
        [
          "A helping hand",
          "{name} asks a trusted grown-up: “Will you sit with me?”",
          "You can ask with words, a picture, or a gesture.",
        ],
        [
          "Together for a while",
          "{name} settles in. There is no hurry to feel a different way.",
          "We can stay here for a little while.",
        ],
      ],
    },
  ];
  let root,
    view = "make",
    coloringScene = "garden",
    selectedPaint = colors[1][1];
  let artwork = load("snow-buddy-art-v1", {}),
    undo = [],
    currentStory = null,
    sceneIndex = 0;
  let playing = false,
    storyTimer = null,
    sound = false,
    movieCancel = null,
    movieUrl = null,
    movieBusy = false;
  let returnView = "make",
    returnStory = null,
    active = false;
  const name = () => buddy.name.trim() || "Buddy";
  const reduced = () =>
    document.body.classList.contains("reduced") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const persist = () => {
    try {
      localStorage.setItem(settingsKey, JSON.stringify(buddy));
    } catch {}
  };
  const persistArt = () => {
    try {
      localStorage.setItem("snow-buddy-art-v1", JSON.stringify(artwork));
    } catch {}
  };
  function tell(text) {
    if (!sound || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.rate = Number(document.querySelector("#speed")?.value || 0.8);
    speechSynthesis.speak(voice);
  }
  function pause() {
    playing = false;
    clearTimeout(storyTimer);
    storyTimer = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  function stop() {
    pause();
    if (movieCancel) movieCancel();
    if (movieUrl) {
      URL.revokeObjectURL(movieUrl);
      movieUrl = null;
    }
    document.removeEventListener("visibilitychange", onVisibility);
    document.querySelector("#buddy-print-sheet")?.remove();
    active = false;
  }
  function onVisibility() {
    if (document.hidden) {
      pause();
      if (movieCancel) movieCancel();
      if (active && view === "stories" && currentStory) renderPlayer();
    }
  }

  // Shared vector artwork keeps the child's animal identical across every activity.
  function drawing({
    outline = false,
    paint = false,
    scene = "garden",
    stage = 0,
    animated = false,
    thumbnail = false,
  } = {}) {
    const ink = "#49544f",
      paper = "#fffdf7";
    const art = outline ? artwork[coloringScene] || {} : {};
    const fill = (id, fallback) =>
      outline
        ? paint && /^#[0-9a-f]{6}$/i.test(art[id] || "")
          ? art[id]
          : "#ffffff"
        : fallback;
    const part = (id, label, fallback) =>
      `fill="${fill(id, fallback)}"${paint ? ` class="paint-part" data-part="${id}" tabindex="0" role="button" aria-label="Color ${label}"` : ""}`;
    const star = (x, y, r = 20) =>
      `${x},${y - r} ${x + r * 0.3},${y - r * 0.3} ${x + r},${y - r * 0.3} ${x + r * 0.46},${y + r * 0.12} ${x + r * 0.63},${y + r * 0.8} ${x},${y + r * 0.4} ${x - r * 0.63},${y + r * 0.8} ${x - r * 0.46},${y + r * 0.12} ${x - r},${y - r * 0.3} ${x - r * 0.3},${y - r * 0.3}`;
    let landscape = `<rect x="3" y="3" width="594" height="474" rx="30" ${part("sky", "the sky", scene === "stars" ? "#e9e5f3" : "#edf4eb")}/>`;
    if (scene === "garden") {
      landscape += `<path d="M4 376 Q150 318 300 377 Q450 320 596 376 V477 H4Z" ${part("grass", "the grass", "#d6e6cc")}/><path d="M60 111 Q45 86 73 76 Q77 48 103 61 Q128 49 140 74 Q165 76 156 101 Q152 112 132 113Z" ${part("cloud", "the cloud", "#fffdf7")}/><circle cx="490" cy="92" r="30" ${part("sun", "the sun", "#f2daa1")}/>`;
      for (const [x, y] of [
        [91, 325],
        [491, 335],
      ])
        landscape += `<path d="M${x} ${y + 16} v62" fill="none"/><path d="M${x} ${y + 55} q-35 -28 -30 -2 q15 14 30 2" ${part("leaves", "the leaves", "#a6c9a2")}/><path d="M${x} ${y + 42} q34 -28 30 -2 q-15 14 -30 2" ${part("leaves", "the leaves", "#a6c9a2")}/><path d="M${x} ${y - 18} c-25 -30 -47 5 -20 21 c-24 24 11 45 23 17 c22 24 43 -10 19 -23 c26 -22 -6 -43 -22 -15Z" ${part("petals", "the flower petals", "#e8bfcc")}/><circle cx="${x}" cy="${y}" r="10" ${part("flower-middle", "the flower centers", "#efda9e")}/>`;
    } else if (scene === "pond") {
      landscape += `<path d="M3 339 Q140 295 270 346 Q450 309 597 340 V477 H3Z" ${part("bank", "the pond bank", "#d8e5d1")}/><ellipse cx="300" cy="432" rx="246" ry="39" ${part("water", "the pond", "#c9e0e5")}/><path d="M69 433 q40 -12 78 0 M443 428 q35 -12 69 0" fill="none"/><path d="M70 322 v-75 m0 32 q-30 -26 -35 -5 m35 33 q30 -25 36 -5 M530 325 v-72" fill="none"/><ellipse cx="530" cy="251" rx="9" ry="23" ${part("reeds", "the reeds", "#d3b397")}/><path d="M466 118 q12 -18 24 0 q12 -18 24 0" fill="none"/>`;
    } else {
      landscape += `<path d="M50 397 L300 55 550 397Z" ${part("tent", "the cozy tent", "#d8cbe8")}/><path d="M168 397 L300 165 435 397Z" ${part("tent-door", "the tent doorway", "#fbf6e9")}/><ellipse cx="300" cy="431" rx="230" ry="29" ${part("rug", "the soft rug", "#d6ded0")}/>`;
      for (const [x, y] of [
        [78, 94],
        [517, 154],
        [451, 69],
        [73, 245],
      ])
        landscape += `<polygon points="${star(x, y, 15)}" ${part("stars", "the stars", "#efdbab")}/>`;
    }
    let ears;
    if (buddy.animal === "bunny")
      ears = `<ellipse cx="252" cy="98" rx="28" ry="73" transform="rotate(-12 252 98)" ${part("fur", "the fur", buddy.color)}/><ellipse cx="348" cy="98" rx="28" ry="73" transform="rotate(12 348 98)" ${part("fur", "the fur", buddy.color)}/><ellipse cx="252" cy="91" rx="12" ry="43" transform="rotate(-12 252 91)" ${part("ear-inner", "the inner ears", "#f4ded5")}/><ellipse cx="348" cy="91" rx="12" ry="43" transform="rotate(12 348 91)" ${part("ear-inner", "the inner ears", "#f4ded5")}/>`;
    else if (buddy.animal === "cat" || buddy.animal === "fox")
      ears = `<path d="M218 159 L213 67 Q215 53 230 65 L274 132 M326 132 L370 65 Q385 53 387 67 L382 159" ${part("fur", "the fur", buddy.color)}/><path d="M229 129 L228 89 254 130 M347 130 L372 89 371 129" ${part("ear-inner", "the inner ears", "#f4ded5")}/>`;
    else
      ears = `<circle cx="222" cy="129" r="37" ${part("fur", "the fur", buddy.color)}/><circle cx="378" cy="129" r="37" ${part("fur", "the fur", buddy.color)}/><circle cx="222" cy="129" r="20" ${part("ear-inner", "the inner ears", "#f4ded5")}/><circle cx="378" cy="129" r="20" ${part("ear-inner", "the inner ears", "#f4ded5")}/>`;
    let patch =
      buddy.patch === "heart"
        ? '<path d="M300 351 C250 320 282 299 300 321 C319 299 350 320 300 351Z"'
        : buddy.patch === "star"
          ? `<polygon points="${star(300, 333, 27)}"`
          : '<path d="M313 309 A26 26 0 1 0 321 351 A25 25 0 0 1 313 309Z"';
    let animal = `<g${animated && !reduced() ? ' class="buddy-alive"' : ""}>
      ${ears}
      <ellipse cx="213" cy="${stage === 2 ? 297 : 320}" rx="32" ry="61" transform="rotate(${stage === 2 ? 55 : 24} 213 320)" ${part("fur", "the fur", buddy.color)}/>
      <ellipse cx="387" cy="${stage === 2 ? 297 : 320}" rx="32" ry="61" transform="rotate(${stage === 2 ? -55 : -24} 387 320)" ${part("fur", "the fur", buddy.color)}/>
      <ellipse cx="300" cy="331" rx="90" ry="96" ${part("fur", "the fur", buddy.color)}/>
      <ellipse cx="248" cy="409" rx="44" ry="31" ${part("paws", "the paws", buddy.color)}/><ellipse cx="352" cy="409" rx="44" ry="31" ${part("paws", "the paws", buddy.color)}/>
      <ellipse cx="248" cy="414" rx="20" ry="13" ${part("paw-pads", "the paw pads", "#f5e4d9")}/><ellipse cx="352" cy="414" rx="20" ry="13" ${part("paw-pads", "the paw pads", "#f5e4d9")}/>
      <ellipse cx="300" cy="335" rx="59" ry="65" ${part("belly", "the tummy", "#fff6e7")}/>
      <path d="M257 294 Q232 340 261 378 M342 294 Q367 340 339 378" fill="none" stroke-dasharray="3 7" stroke-width="2"/>
      <ellipse cx="300" cy="194" rx="104" ry="88" ${part("fur", "the fur", buddy.color)}/>
      <ellipse cx="300" cy="226" rx="49" ry="32" ${part("muzzle", "the muzzle", "#fff6e7")}/>
      ${stage === 3 ? '<path d="M252 195 q11 -10 22 0 M326 195 q11 -10 22 0" fill="none"/>' : '<circle cx="264" cy="193" r="6" fill="#49544f"/><circle cx="336" cy="193" r="6" fill="#49544f"/>'}
      <path d="M291 219 Q300 212 309 219 L300 228Z" fill="#49544f"/>
      <path d="M300 229 v7 m0 -2 q-12 14 -22 0 m22 0 q12 14 22 0" fill="none"/>
      <ellipse cx="235" cy="218" rx="12" ry="7" ${part("cheeks", "the cheeks", "#edb7b3")} stroke="none"/><ellipse cx="365" cy="218" rx="12" ry="7" ${part("cheeks", "the cheeks", "#edb7b3")} stroke="none"/>
      ${buddy.animal === "cat" ? '<path d="M218 221 l-28 -5 m30 16 l-28 6 M382 221 l28 -5 m-30 16 l28 6" fill="none"/>' : ""}
      ${patch} ${part("patch", "the special patch", "#e1adc2")}/>
    </g>`;
    let storyDetail = "";
    if (!outline && !thumbnail && stage > 0) {
      if (scene === "garden")
        storyDetail =
          stage === 1
            ? '<path d="M397 346 Q399 274 365 250" fill="none"/><path d="M365 250 c-27 -25 -41 10 -15 18 c-13 25 21 31 23 7 c27 8 29 -27 7 -22 c1 -24 -27 -25 -15 -3Z" fill="#edc6d5"/><circle cx="371" cy="261" r="7" fill="#efd69f"/>'
            : `<g transform="translate(${stage === 2 ? 325 : 380} 32)"><path d="M0 47 Q-12 24 14 20 Q22 -7 43 13 Q63 3 68 24 Q93 27 79 47Z" fill="#fffdf7"/></g>`;
      if (scene === "pond")
        storyDetail = `<ellipse cx="300" cy="457" rx="${75 + stage * 40}" ry="${6 + stage * 3}" fill="none" stroke="#6b9eaa"/>`;
      if (scene === "stars")
        storyDetail =
          stage === 1
            ? '<rect x="105" y="358" width="81" height="56" rx="22" fill="#e8c0cd"/><path d="M120 371 l50 29 m-50 0 l50 -29" fill="none" stroke-dasharray="3 5"/>'
            : '<path d="M206 363 Q300 330 394 363 L416 432 Q300 454 184 432Z" fill="#c5d8bb"/><path d="M213 375 Q300 350 387 375" fill="none" stroke-dasharray="4 7"/>';
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480"${paint ? ' aria-label="Tap a part of your animal or the scene to color it"' : ` role="img" aria-label="${e(name())}, your stuffed ${buddy.animal}"`}><title>${e(name())}'s ${scene === "stars" ? "cozy hideaway" : scene}</title><g stroke="${ink}" stroke-width="${outline ? 3 : 2.5}" stroke-linecap="round" stroke-linejoin="round">${thumbnail ? `<rect width="600" height="480" rx="30" fill="${paper}" stroke="none"/>` : landscape}${animal}${storyDetail}</g></svg>`;
  }

  function mount(target) {
    root = target;
    active = true;
    sound = false;
    document.addEventListener("visibilitychange", onVisibility);
    render();
  }
  function go(next) {
    pause();
    if (movieCancel) movieCancel();
    view = next;
    currentStory = null;
    render();
    root.querySelector("#buddy-content")?.focus({ preventScroll: true });
    root
      .querySelector(".buddy-tabs")
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function render() {
    root.innerHTML = `<div class="buddy-app">
      <div class="buddy-top"><span class="buddy-wordmark">✳ SNOW DAY <small>little makers</small></span><div class="buddy-top-actions"><button id="buddySound" aria-pressed="${sound}">${sound ? "♫ Sound on" : "♫ Sound off"}</button><button id="buddySettings">⚙ Comfort</button><button id="buddyAdult">Grown-up view ↗</button></div></div>
      <div class="buddy-intro"><p class="eyebrow">A LITTLE FRIEND. A LITTLE MOMENT OF CALM.</p><h1>Hello, curious maker.</h1><p>Make a soft little friend. Take your time together.</p></div>
      <nav class="buddy-tabs" aria-label="Buddy activities">${[
        ["make", "♡", "Make a buddy"],
        ["color", "✎", "Color together"],
        ["stories", "▷", "Story time"],
      ]
        .map(
          ([id, icon, label]) =>
            `<button data-view="${id}" aria-pressed="${view === id}"><span class="activity-icon" aria-hidden="true">${icon}</span>${label}</button>`,
        )
        .join("")}</nav>
      <div id="buddy-content" tabindex="-1"></div>
      <div class="buddy-footer"><p class="buddy-small">Your buddy stays on this device. There is no wrong way to play.</p><button id="buddyRest">☁ I need a quiet moment</button></div>
    </div>`;
    root
      .querySelectorAll("[data-view]")
      .forEach((button) => (button.onclick = () => go(button.dataset.view)));
    root.querySelector("#buddySound").onclick = () => {
      if (!("speechSynthesis" in window)) {
        status(
          "This browser has no voice. The story words are always on screen.",
        );
        return;
      }
      sound = !sound;
      const button = root.querySelector("#buddySound");
      button.setAttribute("aria-pressed", String(sound));
      button.textContent = sound ? "♫ Sound on" : "♫ Sound off";
      if (sound) tell(`Hello. I am ${name()}. We can play at your pace.`);
      else speechSynthesis.cancel();
    };
    root.querySelector("#buddyAdult").onclick = () => {
      location.hash = "home";
    };
    root.querySelector("#buddySettings").onclick = () => {
      pause();
      if (movieCancel) movieCancel();
      if (currentStory) renderPlayer();
      document.querySelector("#settings").showModal();
    };
    root.querySelector("#buddyRest").onclick = rest;
    if (view === "make") renderMaker();
    else if (view === "color") renderColor();
    else if (currentStory) renderPlayer();
    else renderStories();
  }
  function status(message) {
    let node = root.querySelector("#buddy-status");
    if (!node) {
      node = document.createElement("p");
      node.id = "buddy-status";
      node.className = "buddy-message";
      node.setAttribute("role", "status");
      root.querySelector("#buddy-content").append(node);
    }
    node.textContent = message;
  }
  function renderMaker() {
    const content = root.querySelector("#buddy-content");
    content.innerHTML = `<div class="buddy-layout"><div class="buddy-stage"><div id="buddy-preview">${drawing()}</div><div class="buddy-nameplate"><span id="buddy-label">${e(name())}</span><small>A soft friend, made by you.</small></div></div>
      <section class="buddy-panel" aria-label="Make your stuffed animal">
      <fieldset><legend>1. Pick a friend</legend><div class="buddy-choices">${animals.map(([id, label]) => `<button data-animal="${id}" aria-pressed="${buddy.animal === id}"><span aria-hidden="true" style="font-size:2rem">${{ bear: "🐻", bunny: "🐰", cat: "🐱", fox: "🦊" }[id]}</span>${label}</button>`).join("")}</div></fieldset>
      <fieldset><legend>2. Choose a soft color</legend><div class="buddy-swatches">${colors.map(([label, color]) => `<button data-fur="${color}" aria-label="${label} fur" aria-pressed="${buddy.color === color}"><span class="buddy-swatch" style="background:${color}"></span></button>`).join("")}</div></fieldset>
      <fieldset><legend>3. Add a little patch</legend><div class="buddy-symbols">${patches.map(([id, label]) => `<button data-patch="${id}" aria-pressed="${buddy.patch === id}">${{ heart: "♡", star: "☆", moon: "☾" }[id]} ${label}</button>`).join("")}</div></fieldset>
      <label for="buddyName">What is your buddy’s name?</label><input id="buddyName" type="text" maxlength="18" autocomplete="off" value="${e(buddy.name)}" placeholder="Buddy"/>
      <p class="buddy-small">A made-up name is perfect. Your choices save as you go.</p><button class="primary wide" id="buddyReady">Let’s color together →</button>
      </section></div>`;
    function update() {
      persist();
      root.querySelector("#buddy-preview").innerHTML = drawing();
      root.querySelector("#buddy-label").textContent = name();
    }
    for (const [attribute, key] of [
      ["animal", "animal"],
      ["fur", "color"],
      ["patch", "patch"],
    ]) {
      content.querySelectorAll(`[data-${attribute}]`).forEach(
        (button) =>
          (button.onclick = () => {
            buddy[key] = button.dataset[attribute];
            content
              .querySelectorAll(`[data-${attribute}]`)
              .forEach((item) =>
                item.setAttribute("aria-pressed", String(item === button)),
              );
            update();
          }),
      );
    }
    content.querySelector("#buddyName").oninput = (event) => {
      buddy.name = event.target.value;
      update();
    };
    content.querySelector("#buddyReady").onclick = () => {
      tell(`Let's color with ${name()}. Choose a color, then tap a shape.`);
      go("color");
    };
  }
  function renderColor() {
    const content = root.querySelector("#buddy-content");
    const paintButtons = paints.map(([label, color]) => `<button data-paint="${color}" aria-label="Paint ${label}" aria-pressed="${selectedPaint === color}"><span class="buddy-swatch" style="background:${color}"></span></button>`).join("");
    content.innerHTML = `<div class="buddy-layout color-layout"><section><div class="scene-choices" aria-label="Coloring page scene">${[
      ["garden", "✿ Garden"],
      ["pond", "≈ Pond"],
      ["stars", "☆ Hideaway"],
    ]
      .map(
        ([id, label]) =>
          `<button data-scene="${id}" aria-pressed="${coloringScene === id}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="paint-toolbar"><p>Pick a color. Tap a shape.</p><div class="buddy-swatches" aria-label="Paint colors">${paintButtons}</div></div><div id="color-sheet" class="buddy-canvas"></div></section>
      <section class="buddy-panel color-panel"><h2>Color with ${e(name())}</h2><p id="paint-status" class="buddy-small" role="status">${paints.find(([, c]) => c === selectedPaint)[0]} is ready.</p>
      <div class="buddy-controls"><button id="paintUndo" ${undo.length ? "" : "disabled"}>↶ Undo</button><button id="paintClear">Fresh page</button></div>
      <button class="wide" id="printPage">▤ Print a coloring page</button><button class="wide" id="downloadPage">↓ Save a coloring page</button><button class="wide" id="downloadArt">↓ Save my colorful picture</button><p class="buddy-small">Paper pages are black-and-white. Your colorful picture saves separately.</p><button class="primary wide" id="colorStory">Bring my buddy to life →</button></section></div>`;
    refreshSheet();
    content.querySelectorAll("[data-scene]").forEach(
      (button) =>
        (button.onclick = () => {
          coloringScene = button.dataset.scene;
          undo = [];
          renderColor();
        }),
    );
    content.querySelectorAll("[data-paint]").forEach(
      (button) =>
        (button.onclick = () => {
          selectedPaint = button.dataset.paint;
          content
            .querySelectorAll("[data-paint]")
            .forEach((item) =>
              item.setAttribute("aria-pressed", String(item === button)),
            );
          content.querySelector("#paint-status").textContent =
            `${paints.find(([, c]) => c === selectedPaint)[0]} is ready.`;
        }),
    );
    content.querySelector("#paintUndo").onclick = () => {
      if (undo.length) {
        artwork[coloringScene] = undo.pop();
        persistArt();
        refreshSheet();
      }
    };
    content.querySelector("#paintClear").onclick = () => {
      undo.push({ ...artwork[coloringScene] });
      artwork[coloringScene] = {};
      persistArt();
      refreshSheet();
    };
    content.querySelector("#downloadPage").onclick = () =>
      download(
        new Blob([drawing({ outline: true, scene: coloringScene })], {
          type: "image/svg+xml",
        }),
        "my-buddy-coloring-page.svg",
      );
    content.querySelector("#downloadArt").onclick = () =>
      download(
        new Blob(
          [
            drawing({
              outline: true,
              paint: true,
              scene: coloringScene,
            }).replace(/ tabindex="0" role="button"/g, ""),
          ],
          { type: "image/svg+xml" },
        ),
        "my-buddy-picture.svg",
      );
    content.querySelector("#printPage").onclick = () => {
      document.querySelector("#buddy-print-sheet")?.remove();
      const sheet = document.createElement("div");
      sheet.id = "buddy-print-sheet";
      sheet.innerHTML = `<h1>${e(name())}'s coloring page</h1>${drawing({ outline: true, scene: coloringScene })}<p>Made by me · SNOW DAY Learning Lab</p>`;
      document.body.append(sheet);
      window.print();
    };
    content.querySelector("#colorStory").onclick = () => go("stories");
  }
  function refreshSheet() {
    const sheet = root.querySelector("#color-sheet");
    sheet.innerHTML = drawing({
      outline: true,
      paint: true,
      scene: coloringScene,
    });
    const apply = (target) => {
      undo.push({ ...artwork[coloringScene] });
      if (undo.length > 40) undo.shift();
      artwork[coloringScene] = {
        ...artwork[coloringScene],
        [target.dataset.part]: selectedPaint,
      };
      persistArt();
      sheet
        .querySelectorAll(`[data-part="${target.dataset.part}"]`)
        .forEach((part) => part.setAttribute("fill", selectedPaint));
      root.querySelector("#paintUndo").disabled = false;
      root.querySelector("#paint-status").textContent =
        "A little more color. Make it your own.";
    };
    sheet.querySelectorAll("[data-part]").forEach((part) => {
      part.onclick = () => apply(part);
      part.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          apply(part);
        }
      };
    });
    root.querySelector("#paintUndo").disabled = !undo.length;
  }
  function download(blob, filename) {
    const url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function renderStories() {
    root.querySelector("#buddy-content").innerHTML =
      `<p class="buddy-message">${e(name())} is ready for a little adventure. Which one feels right?</p><div class="buddy-story-grid">${stories.map((story) => `<article class="buddy-story-card">${drawing({ scene: story.theme })}<h2>${story.title}</h2><p>${story.skill}</p><button class="primary" data-story="${story.id}">▷ Watch this story</button></article>`).join("")}</div><p class="buddy-small" style="text-align:center">Short animated stories with your own buddy. You can watch, join in, or stop.</p>`;
    root.querySelectorAll("[data-story]").forEach(
      (button) =>
        (button.onclick = () => {
          if (movieUrl) {
            URL.revokeObjectURL(movieUrl);
            movieUrl = null;
          }
          currentStory = stories.find(
            (story) => story.id === button.dataset.story,
          );
          sceneIndex = 0;
          renderPlayer();
          root
            .querySelector(".story-player")
            ?.scrollIntoView({ block: "start", behavior: "instant" });
          tell(sceneText()[1]);
        }),
    );
  }
  function sceneText(index = sceneIndex) {
    return currentStory.scenes[index].map((text) =>
      text.replaceAll("{name}", name()),
    );
  }
  function renderPlayer() {
    if (!currentStory || !active) return;
    const [title, caption, hint] = sceneText();
    root.querySelector("#buddy-content").innerHTML =
      `<section class="story-player" aria-label="${e(currentStory.title)}">
      <div class="story-top"><button id="backStories">← Stories</button><p class="buddy-small">${sceneIndex + 1} of 4 · Your pace</p></div>
      <div class="story-screen"><div id="story-picture">${drawing({ scene: currentStory.theme, stage: sceneIndex, animated: playing })}</div><div class="story-caption" aria-live="polite"><h2>${e(title)}</h2><p>${e(caption)}</p></div></div>
      <div class="story-progress" aria-hidden="true">${[0, 1, 2, 3].map((i) => `<span class="${i === sceneIndex ? "current" : ""}"></span>`).join("")}</div>
      <div class="buddy-controls"><button id="storyPrevious" ${sceneIndex === 0 ? "disabled" : ""}>← Back</button><button class="primary" id="storyPlay">${playing ? "Ⅱ Pause" : "▷ Play gently"}</button><button id="storyNext">${sceneIndex === 3 ? "↶ Again" : "Next →"}</button></div>
      <p class="buddy-message">${e(hint)}</p>
      <div class="movie-tools"><button id="makeMovie" ${movieBusy ? "disabled" : ""}>↓ Make a little video</button><p class="buddy-small">A 28-second animated montage of ${e(name())}, with all four scenes and captions. Saved videos are silent.</p><div id="movie-output" role="status"></div></div>
    </section>`;
    root.querySelector("#backStories").onclick = () => {
      pause();
      if (movieCancel) movieCancel();
      currentStory = null;
      renderStories();
    };
    root.querySelector("#storyPrevious").onclick = () => {
      pause();
      sceneIndex = Math.max(0, sceneIndex - 1);
      renderPlayer();
      tell(sceneText()[1]);
    };
    root.querySelector("#storyNext").onclick = () => {
      pause();
      sceneIndex = (sceneIndex + 1) % 4;
      renderPlayer();
      tell(sceneText()[1]);
    };
    root.querySelector("#storyPlay").onclick = () => {
      if (playing) {
        pause();
        renderPlayer();
      } else {
        if (sceneIndex === 3) sceneIndex = 0;
        playing = true;
        renderPlayer();
        tell(sceneText()[1]);
        scheduleNext();
      }
    };
    root.querySelector("#makeMovie").onclick = makeMovie;
    if (movieUrl) showMovie(movieUrl);
  }
  function scheduleNext() {
    clearTimeout(storyTimer);
    // Slow pacing leaves room to hear captions; children can also choose Next.
    storyTimer = setTimeout(() => {
      if (!active || !playing) return;
      if (sceneIndex === 3) {
        pause();
        renderPlayer();
        return;
      }
      sceneIndex++;
      renderPlayer();
      tell(sceneText()[1]);
      scheduleNext();
    }, 12000);
  }
  function rest() {
    pause();
    if (movieCancel) movieCancel();
    returnView = view;
    returnStory = currentStory;
    root.querySelector("#buddy-content").innerHTML =
      `<section class="buddy-rest">${drawing({ scene: "stars", stage: 3, thumbnail: true })}<h2>We can just be here.</h2><p>No need to do anything. Your buddy can wait with you.</p><p class="buddy-message" id="restWords">Find a position that feels comfortable for you.</p><div class="buddy-controls"><button id="restHelp">♡ I want a grown-up</button><button id="restReturn" class="primary">I’m ready to play</button></div></section>`;
    root.querySelector("#restHelp").onclick = () => {
      root.querySelector("#restWords").textContent =
        "You can show this screen to a trusted grown-up: “Please sit with me.”";
      tell("Please sit with me.");
    };
    root.querySelector("#restReturn").onclick = () => {
      view = returnView;
      currentStory = returnStory;
      render();
    };
    root
      .querySelector(".buddy-rest")
      ?.scrollIntoView({ block: "start", behavior: "instant" });
    tell("We can just be here. Your buddy can wait with you.");
  }

  function showMovie(url) {
    const output = root?.querySelector("#movie-output");
    if (!output) return;
    output.innerHTML = `<video controls playsinline preload="metadata" aria-label="Your buddy’s animated calming story"></video><a download="my-buddy-story.webm">↓ Save my video</a>`;
    output.querySelector("video").src = url;
    output.querySelector("a").href = url;
  }
  async function makeMovie() {
    const output = root.querySelector("#movie-output"),
      button = root.querySelector("#makeMovie");
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      output.textContent =
        "Video saving is not available in this browser. You can still watch every story here.";
      return;
    }
    const mime = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ].find((type) => MediaRecorder.isTypeSupported(type));
    if (!mime) {
      output.textContent =
        "This browser cannot save a movie. The story player above is ready to use.";
      return;
    }
    pause();
    renderPlayer();
    const currentOutput = root.querySelector("#movie-output"),
      currentButton = root.querySelector("#makeMovie");
    currentButton.disabled = true;
    movieBusy = true;
    ["#storyPrevious", "#storyNext", "#storyPlay"].forEach((selector) => {
      root.querySelector(selector).disabled = true;
    });
    currentOutput.innerHTML =
      '<p id="movie-progress">Getting your story ready…</p><button id="cancelMovie">Cancel video</button>';
    let canceled = false,
      recorder,
      stream,
      frame,
      done = false;
    const cleanup = () => {
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      movieBusy = false;
      movieCancel = null;
      if (active && root.querySelector("#makeMovie"))
        root.querySelector("#makeMovie").disabled = false;
      if (active && root.querySelector("#storyPlay")) {
        root.querySelector("#storyPlay").disabled = false;
        root.querySelector("#storyNext").disabled = false;
        root.querySelector("#storyPrevious").disabled = sceneIndex === 0;
      }
    };
    const cancel = () => {
      if (done) return;
      canceled = true;
      done = true;
      if (recorder?.state === "recording") recorder.stop();
      cleanup();
      if (currentOutput.isConnected)
        currentOutput.textContent = "Video stopped. Your buddy is still here.";
    };
    movieCancel = cancel;
    root.querySelector("#cancelMovie").onclick = cancel;
    const story = currentStory,
      lines = story.scenes.map((_, i) => sceneText(i)),
      still = reduced();
    try {
      const images = await Promise.all(
        story.scenes.map(
          (_, i) =>
            new Promise((resolve, reject) => {
              const url = URL.createObjectURL(
                new Blob([drawing({ scene: story.theme, stage: i })], {
                  type: "image/svg+xml",
                }),
              );
              const image = new Image();
              image.onload = () => {
                URL.revokeObjectURL(url);
                resolve(image);
              };
              image.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Could not prepare artwork"));
              };
              image.src = url;
            }),
        ),
      );
      if (canceled) return;
      const canvas = document.createElement("canvas");
      canvas.width = 960;
      canvas.height = 900;
      const context = canvas.getContext("2d");
      stream = canvas.captureStream(24);
      const chunks = [];
      recorder = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: 2200000,
      });
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        cancel();
        if (currentOutput.isConnected)
          currentOutput.textContent =
            "We could not finish this video. You can try again or watch the story here.";
      };
      recorder.onstop = () => {
        if (canceled) return;
        done = true;
        cleanup();
        if (movieUrl) URL.revokeObjectURL(movieUrl);
        movieUrl = URL.createObjectURL(new Blob(chunks, { type: mime }));
        if (active) {
          showMovie(movieUrl);
          const link = root.querySelector("#movie-output a");
          if (link)
            link.download = mime.includes("mp4")
              ? "my-buddy-story.mp4"
              : "my-buddy-story.webm";
        }
      };
      function wrap(text, y, font, color, maxWidth = 830) {
        context.font = font;
        context.fillStyle = color;
        context.textAlign = "center";
        let row = "";
        for (const word of text.split(" ")) {
          const next = row ? row + " " + word : word;
          if (context.measureText(next).width > maxWidth && row) {
            context.fillText(row, 480, y);
            y += 40;
            row = word;
          } else row = next;
        }
        context.fillText(row, 480, y);
        return y + 40;
      }
      const start = performance.now();
      let lastSecond = -1;
      function draw(now) {
        if (canceled) return;
        const elapsed = (now - start) / 1000,
          index = Math.min(3, Math.floor(elapsed / 7)),
          within = elapsed % 7;
        context.fillStyle = "#fffdf7";
        context.fillRect(0, 0, 960, 900);
        context.save();
        context.beginPath();
        context.rect(0, 0, 960, 660);
        context.clip();
        const zoom = still ? 1 : 1 + Math.sin((within / 7) * Math.PI) * 0.016;
        context.translate(480, 330);
        context.scale(zoom, zoom);
        context.drawImage(images[index], -412.5, -330, 825, 660);
        context.restore();
        wrap(lines[index][0], 704, "bold 29px sans-serif", "#29483c");
        wrap(lines[index][1], 751, "26px sans-serif", "#344a42");
        context.font = "18px sans-serif";
        context.fillStyle = "#566a60";
        context.fillText(
          `${index + 1} / 4  ·  SNOW DAY Learning Lab`,
          480,
          878,
        );
        const second = Math.floor(elapsed);
        if (second !== lastSecond) {
          lastSecond = second;
          const progress = root.querySelector("#movie-progress");
          if (progress)
            progress.textContent = `Making your video… ${Math.min(28, second)} of 28 seconds. Keep this tab open.`;
        }
        if (elapsed >= 28) {
          recorder.stop();
          return;
        }
        frame = requestAnimationFrame(draw);
      }
      draw(start);
      recorder.start(1000);
    } catch (error) {
      cancel();
      if (currentOutput.isConnected)
        currentOutput.textContent =
          "Video saving did not work this time. Your story is ready to watch above.";
    }
  }
  return { mount, stop };
})();
