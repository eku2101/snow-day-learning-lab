/* Original, still SVG illustrations. Captions stay in HTML for flexible reading.
   Only buddySvg may contain markup; callers supply it from BuddyStudio.character(). */
(() => {
  "use strict";
  const c = {
    ink: "#3E514D", paper: "#FAFAF5", white: "#FFFFFF", mint: "#E8F1EE",
    teal: "#2C6E63", sage: "#B4CEC1", lavender: "#DCD6F3", violet: "#797094",
    gold: "#E9CC8A", blue: "#C8DFE5", rose: "#EAC6BE", wood: "#D8B694",
    skin: "#C58B68", deepSkin: "#885844", lightSkin: "#E8B99B", hair: "#493B37",
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const wrap = (label, art) => `<svg class="studio-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" width="720" height="440" role="img" aria-label="${esc(label)}" focusable="false"><g stroke="${c.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="720" height="440" rx="24" fill="${c.paper}" stroke="none"/>${art}</g></svg>`;
  const base = () => `<path d="M35 349Q184 318 354 344T685 347V416H35Z" fill="${c.mint}" stroke="none"/><path d="M65 375H656" fill="none" stroke="${c.sage}"/>`;
  const plant = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-19 0H19L14 37H-14Z" fill="${c.rose}"/><path d="M0-5V-67" fill="none"/><path d="M0-28Q-36-26-27-56Q0-57 0-28ZM0-45Q35-43 29-75Q0-70 0-45Z" fill="${c.sage}"/></g>`;
  const sheet = (x, y, w = 105, h = 80, color = c.white) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${color}"/>`;
  const leaf = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-25 17Q-41-25 20-31Q37 9-25 17Z" fill="${c.sage}"/><path d="M-29 24L16-24" fill="none"/></g>`;
  const fish = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-29 0L-50-18V18Z" fill="${c.gold}"/><ellipse rx="32" ry="20" fill="${c.gold}"/><circle cx="16" cy="-4" r="3" fill="${c.ink}" stroke="none"/><path d="M-3-10L5 1-5 9" fill="none"/></g>`;
  const rabbit = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="12" rx="24" ry="27" fill="${c.rose}"/><ellipse cx="-10" cy="-28" rx="7" ry="23" fill="${c.rose}"/><ellipse cx="9" cy="-28" rx="7" ry="23" fill="${c.rose}"/><circle cy="-6" r="20" fill="${c.rose}"/><circle cx="-6" cy="-9" r="2" fill="${c.ink}"/><circle cx="7" cy="-9" r="2" fill="${c.ink}"/><path d="M-3 1H3L0 4Z" fill="${c.ink}"/></g>`;
  const marker = (x, y, rotation = 0) => `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="-8" y="-42" width="16" height="75" rx="5" fill="${c.blue}"/><path d="M-8-25H8M-7 33L0 45 7 33" fill="${c.gold}"/></g>`;
  const speech = (x, y, fill = c.white) => `<g transform="translate(${x} ${y})"><path d="M-38-25H38Q48-25 48-15V16Q48 26 38 26H-13L-29 40-27 26H-38Q-48 26-48 16V-15Q-48-25-38-25Z" fill="${fill}"/><circle cx="-18" r="3" fill="${c.ink}"/><circle r="3" fill="${c.ink}"/><circle cx="18" r="3" fill="${c.ink}"/></g>`;

  // Proportions suit older learners too; poses show actions rather than a required facial expression.
  function person({ x, y, scale = 1, skin = c.skin, shirt = c.teal, hair = "curl", pose = "rest", legs = true, glasses = false }) {
    let backHair = "", frontHair = "";
    if (hair === "long") {
      backHair = `<path d="M-33 0Q-38-45 0-46Q40-44 35 5L44 72Q1 90-40 68Z" fill="${c.hair}"/>`;
      frontHair = `<path d="M-29-8Q-38-47 0-44Q38-42 31-7Q5-11 3-31Q-8-11-29-8Z" fill="${c.hair}"/>`;
    } else if (hair === "curl") {
      frontHair = `<path d="M-30-6Q-46-17-33-29Q-40-42-24-45Q-18-59-4-48Q7-60 18-46Q35-52 37-35Q50-25 33-10L26-25Q8-17-9-28Q-17-14-30-6Z" fill="${c.hair}"/>`;
    } else {
      frontHair = `<path d="M-29-9Q-35-42-4-45Q29-51 34-12L23-21Q1-13-14-26L-21-8Z" fill="${c.hair}"/>`;
    }
    const arm = pose === "offer"
      ? `<path d="M-36 61Q-56 94-73 113L-114 105M36 61L52 114 82 117" fill="none" stroke="${skin}" stroke-width="18"/><path d="M-111 105L-127 99M80 117L94 112" stroke="${skin}" stroke-width="11"/>`
      : pose === "point"
        ? `<path d="M-35 61L-58 96-103 76M35 61L45 116" fill="none" stroke="${skin}" stroke-width="18"/><path d="M-100 77L-119 68" stroke="${skin}" stroke-width="10"/>`
        : pose === "listen"
          ? `<path d="M-36 61L-45 111-10 124M36 61L51 109 19 124" fill="none" stroke="${skin}" stroke-width="18"/>`
          : `<path d="M-36 61L-49 122M36 61L48 122" fill="none" stroke="${skin}" stroke-width="18"/>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})">${backHair}
      ${legs ? `<path d="M-23 130L-24 215M23 130L27 215" fill="none" stroke="${c.violet}" stroke-width="28"/><path d="M-38 216H-10M16 216H46" stroke="${c.ink}" stroke-width="13"/>` : ""}
      <path d="M-12 20V48H12V20" fill="${skin}"/>
      ${arm}<path d="M-13 39Q-32 40-43 56L-33 80-32 141H34L32 80 44 57Q27 39 13 39Q1 49-13 39Z" fill="${shirt}"/>
      <ellipse cy="-1" rx="30" ry="35" fill="${skin}"/>${frontHair}
      <path d="M-11-3V0M11-3V0M-7 15Q0 19 7 15" fill="none"/>
      ${glasses ? `<rect x="-24" y="-10" width="20" height="17" rx="6" fill="none"/><rect x="4" y="-10" width="20" height="17" rx="6" fill="none"/><path d="M-4-3H4" fill="none"/>` : ""}
    </g>`;
  }

  const habitats = () => wrap("Animal cards sorted into pond and woodland habitats, with tallies and a comparison chart beside the sorting trays.", `${base()}
    <rect x="49" y="95" width="390" height="252" rx="24" fill="${c.wood}"/>
    <rect x="65" y="111" width="173" height="220" rx="15" fill="${c.blue}"/><path d="M79 199Q107 188 133 200T190 200T223 198M79 296Q110 284 138 296T223 296" fill="none" stroke="${c.white}"/>
    <rect x="252" y="111" width="170" height="220" rx="15" fill="${c.mint}"/>
    ${sheet(89, 142, 125, 91)}${fish(156, 188, 0.83)}${sheet(117, 248, 97, 62)}${fish(167, 278, 0.57)}
    ${sheet(277, 143, 118, 105)}${rabbit(336, 196, 0.8)}${leaf(301, 289, 0.54)}${leaf(370, 290, 0.59)}
    ${sheet(467, 68, 199, 286)}<path d="M490 89H644" fill="none" stroke="${c.sage}"/>
    ${fish(516, 125, 0.37)}<path d="M559 111V140M572 111V140" fill="none" stroke="${c.teal}"/>
    ${rabbit(517, 175, 0.36)}<path d="M560 159V188M572 159V188M584 159V188M596 159V188M552 183L601 163" fill="none" stroke="${c.teal}"/>
    <path d="M494 219V328H641" fill="none"/><rect x="517" y="280" width="36" height="48" rx="4" fill="${c.blue}"/><rect x="583" y="227" width="36" height="101" rx="4" fill="${c.sage}"/>
    ${marker(438, 357, 54)}<circle cx="88" cy="61" r="14" fill="${c.gold}" stroke="none"/>`);

  const sensory = () => wrap("A tactile story board with woven fabric, raised paths, soft patches, picture cards, and a large audio switch for different ways to tell a story.", `${base()}
    <rect x="74" y="71" width="448" height="291" rx="24" fill="${c.wood}"/><rect x="88" y="86" width="420" height="263" rx="15" fill="${c.white}"/>
    <rect x="108" y="108" width="112" height="112" rx="18" fill="${c.lavender}"/>
    <path d="M123 126H204M123 146H204M123 166H204M123 186H204M136 116V207M157 116V207M178 116V207M199 116V207" fill="none" stroke="${c.violet}" stroke-width="5"/>
    <rect x="238" y="108" width="112" height="112" rx="18" fill="${c.mint}"/><path d="M259 203V166Q259 143 281 143H308Q330 143 330 123M260 183H310" fill="none" stroke="${c.teal}" stroke-width="9"/>
    <rect x="368" y="108" width="119" height="112" rx="18" fill="${c.rose}"/><path d="M391 166Q382 147 400 141Q402 124 421 135Q440 124 446 143Q469 141 467 163Q478 183 457 189Q454 209 434 198Q413 211 405 191Q383 190 391 166Z" fill="${c.paper}" stroke-dasharray="3 7"/>
    ${sheet(109, 241, 111, 87, c.mint)}${leaf(166, 287, 0.7)}
    ${sheet(240, 241, 111, 87, c.blue)}${fish(303, 284, 0.68)}
    ${sheet(371, 241, 116, 87, c.lavender)}<path d="M394 290L429 258 464 290V312H394Z" fill="${c.white}"/><path d="M423 312V291H437V312" fill="${c.wood}"/>
    <path d="M523 189Q600 183 584 247" fill="none" stroke-width="5"/>
    <ellipse cx="589" cy="298" rx="63" ry="29" fill="${c.ink}"/><path d="M527 278V298Q589 331 651 298V278" fill="${c.teal}"/><ellipse cx="589" cy="277" rx="62" ry="33" fill="${c.sage}"/>
    <path d="M570 275H579L590 265V291L579 281H570Z" fill="${c.white}"/><path d="M600 270Q608 278 600 286" fill="none" stroke="${c.white}"/>
    <path d="M562 110Q585 93 611 110M574 127Q585 120 598 127" fill="none" stroke="${c.violet}"/>`);

  const shields = () => wrap("A cardboard light shield shades a small plant and model habitat. Sunlight, a thermometer, and an uncovered plant invite children to compare the two spaces.", `${base()}
    <circle cx="594" cy="81" r="36" fill="${c.gold}"/><path d="M594 23V12M594 139V151M536 81H524M652 81H666M553 40L543 30M635 122L645 132M635 40L645 30" fill="none" stroke="${c.gold}" stroke-width="6"/>
    <path d="M544 128L449 244M568 143L501 259" fill="none" stroke="${c.gold}" stroke-width="5" stroke-dasharray="10 11"/>
    <path d="M98 338L152 196H361L405 338Z" fill="${c.blue}" stroke="none"/>
    <rect x="80" y="315" width="380" height="45" rx="12" fill="${c.wood}"/><rect x="99" y="330" width="342" height="14" rx="7" fill="${c.sage}" stroke="none"/>
    <path d="M123 317V167M392 317V167" fill="none" stroke="${c.wood}" stroke-width="13"/>
    <path d="M89 172L158 105H366L428 172Z" fill="${c.wood}"/><path d="M111 171H408M162 111L144 169M357 111L378 169" fill="none"/>
    ${plant(190, 278, 0.92)}${rabbit(298, 282, 0.77)}
    <path d="M356 227V282A16 16 0 1 1 341 282V227Q349 217 356 227Z" fill="${c.white}"/><circle cx="348" cy="296" r="8" fill="${c.teal}" stroke="none"/><path d="M348 293V261" stroke="${c.teal}" stroke-width="5"/>
    <ellipse cx="563" cy="357" rx="81" ry="15" fill="${c.sage}" stroke="none"/>${plant(548, 314, 1.3)}
    <path d="M638 243V308A16 16 0 1 1 623 308V243Q630 233 638 243Z" fill="${c.white}"/><circle cx="630" cy="322" r="8" fill="${c.violet}" stroke="none"/><path d="M630 319V259" stroke="${c.violet}" stroke-width="5"/>`);

  function lesson(id) {
    const lessons = { habitats, sensory, shields };
    return Object.hasOwn(lessons, id) ? lessons[id]() : "";
  }

  function peopleScene(id) {
    if (id === "sharing") return `${person({ x: 210, y: 125, skin: c.deepSkin, shirt: c.lavender, hair: "curl", pose: "listen" })}${person({ x: 510, y: 125, skin: c.lightSkin, shirt: c.teal, hair: "short", pose: "offer", glasses: true })}
      <rect x="90" y="270" width="543" height="27" rx="10" fill="${c.wood}"/><path d="M119 298V373M605 298V373" stroke-width="11"/>
      ${sheet(153, 246, 125, 18)}${sheet(443, 247, 116, 17)}<path d="M171 251L187 245 203 255 222 245" fill="none" stroke="${c.teal}"/>
      <path d="M248 222L333 231" fill="none" stroke="${c.deepSkin}" stroke-width="15"/><path d="M400 224L358 230" fill="none" stroke="${c.lightSkin}" stroke-width="15"/>${marker(349, 230, 75)}${speech(349, 85, c.mint)}`;
    if (id === "space") return `<rect x="101" y="239" width="365" height="27" rx="9" fill="${c.wood}"/><path d="M127 264V366M442 264V366" stroke="${c.wood}" stroke-width="13"/>
      ${person({ x: 242, y: 112, skin: c.deepSkin, shirt: c.lavender, hair: "curl", pose: "listen", scale: 0.95 })}
      <path d="M203 106Q205 55 241 55Q280 57 280 106" fill="none" stroke="${c.violet}" stroke-width="9"/><rect x="201" y="96" width="13" height="30" rx="5" fill="${c.lavender}"/><rect x="271" y="96" width="13" height="30" rx="5" fill="${c.lavender}"/>
      ${person({ x: 559, y: 129, skin: c.lightSkin, shirt: c.teal, hair: "short", pose: "rest", scale: 0.9, glasses: true })}${plant(80, 325, 1.2)}${speech(429, 95, c.white)}
      <path d="M353 308H421M353 321H399" fill="none" stroke="${c.sage}" stroke-width="5"/>`;
    if (id === "change") return `${person({ x: 154, y: 128, skin: c.deepSkin, shirt: c.lavender, hair: "curl", pose: "listen" })}${person({ x: 564, y: 128, skin: c.lightSkin, shirt: c.teal, hair: "short", pose: "point", glasses: true })}
      <rect x="267" y="105" width="189" height="223" rx="15" fill="${c.wood}"/>
      ${sheet(286, 124, 151, 82, c.blue)}<path d="M315 176L341 148 367 176M342 148V186M395 150V181M380 165H410" fill="none" stroke="${c.teal}" stroke-width="5"/>
      <path d="M350 215L362 227 374 215" fill="none"/><path d="M362 207V226" fill="none"/>
      ${sheet(286, 239, 151, 68, c.mint)}<path d="M311 284V262Q335 255 359 264Q384 255 411 262V284Q385 277 359 286Q334 277 311 284Z" fill="${c.white}"/><path d="M359 265V285" fill="none"/>
      ${speech(359, 56, c.white)}`;
    return `${person({ x: 179, y: 139, skin: c.deepSkin, shirt: c.lavender, hair: "curl", pose: "listen", scale: 0.95 })}${person({ x: 536, y: 139, skin: c.lightSkin, shirt: c.teal, hair: "short", pose: "listen", scale: 0.95, glasses: true })}
      ${person({ x: 356, y: 191, skin: c.skin, shirt: c.gold, hair: "short", pose: "rest", scale: 0.72, legs: false })}
      <rect x="93" y="301" width="542" height="26" rx="11" fill="${c.wood}"/><path d="M117 330V373M609 330V373" stroke-width="11"/>
      <rect x="309" y="268" width="98" height="65" rx="9" fill="${c.teal}"/><rect x="318" y="277" width="80" height="44" rx="5" fill="${c.white}"/><rect x="324" y="283" width="18" height="14" rx="3" fill="${c.rose}"/><rect x="349" y="283" width="18" height="14" rx="3" fill="${c.blue}"/><rect x="374" y="283" width="18" height="14" rx="3" fill="${c.sage}"/><path d="M327 309H386" fill="none" stroke="${c.violet}"/>
      ${speech(352, 82, c.mint)}${leaf(539, 297, 0.47)}`;
  }

  function buddyScene(id, buddySvg) {
    // Nested SVG retains the original animal's own accessible name and appearance.
    const setting = id === "space" ? `<rect x="74" y="328" width="350" height="24" rx="11" fill="${c.wood}"/><path d="M99 351V377M398 351V377" stroke-width="9"/>${plant(633, 330, 1.15)}`
      : id === "change" ? `<rect x="421" y="67" width="116" height="139" rx="13" fill="${c.wood}"/>${sheet(435, 80, 88, 49, c.blue)}${sheet(435, 143, 88, 49, c.mint)}<path d="M455 112L479 91 502 112M454 174H503M478 155V180" fill="none"/>`
        : `<rect x="90" y="325" width="544" height="25" rx="11" fill="${c.wood}"/><path d="M112 351V379M609 351V379" stroke-width="10"/>${sheet(382, 304, 128, 20)}${id === "sharing" ? marker(369, 306, 65) : speech(408, 82, c.mint)}`;
    return `<g transform="translate(63 73) scale(.53)">${buddySvg}</g>${person({ x: 553, y: 146, skin: c.deepSkin, shirt: c.lavender, hair: "curl", pose: id === "sharing" ? "offer" : "listen", scale: 0.86 })}${setting}`;
  }

  function scene(id, { buddySvg = "", name = "Your buddy" } = {}) {
    const labels = {
      sharing: "two makers making a plan to share one art tool",
      space: "one learner taking space at a quiet bench while a friend waits nearby",
      change: "learners looking at picture cards to understand a changed plan",
      belonging: "learners making room for another person's idea, with a tablet available for communicating",
    };
    if (!Object.hasOwn(labels, id)) return "";
    const buddyLabels = { sharing: "sharing an art tool", space: "taking time beside a quiet bench", change: "looking at picture cards for a changed plan", belonging: "making room to listen and share ideas" };
    const label = buddySvg ? `${name} practicing with a fictional learner: ${buddyLabels[id]}.` : `${labels[id][0].toUpperCase()}${labels[id].slice(1)}.`;
    return wrap(label, `${base()}${buddySvg ? buddyScene(id, buddySvg) : peopleScene(id)}`);
  }

  function welcome() {
    return wrap("An adult and two young makers create together around a table. One maker uses a wheelchair, and a communication tablet, drawing materials, blocks, and a plant are within reach.", `${base()}
      <path d="M117 85Q166 38 241 65M477 60Q552 38 606 90" fill="none" stroke="${c.sage}" stroke-width="7"/>
      ${person({ x: 178, y: 135, skin: c.deepSkin, shirt: c.teal, hair: "long", pose: "listen", scale: 1.05, glasses: true })}
      ${person({ x: 358, y: 178, skin: c.lightSkin, shirt: c.lavender, hair: "short", pose: "listen", scale: 0.76, legs: false })}
      <path d="M531 224H597V303H627" fill="none" stroke="${c.violet}" stroke-width="10"/>
      <circle cx="560" cy="320" r="59" fill="${c.paper}" stroke="${c.violet}" stroke-width="7"/><circle cx="560" cy="320" r="45" fill="none" stroke="${c.violet}"/><path d="M560 276V364M516 320H604M528 288L591 351M529 351L590 289" fill="none" stroke="${c.violet}" stroke-width="2"/>
      <circle cx="636" cy="366" r="13" fill="${c.violet}"/>
      ${person({ x: 552, y: 144, skin: c.skin, shirt: c.gold, hair: "curl", pose: "listen", scale: 0.94, legs: false })}
      <path d="M572 268L608 294 620 342H639" fill="none" stroke="${c.violet}" stroke-width="20"/>
      <rect x="90" y="279" width="537" height="27" rx="11" fill="${c.wood}"/><path d="M118 307V374M482 307V374" stroke="${c.wood}" stroke-width="12"/>
      ${sheet(139, 257, 116, 18)}<path d="M153 261L174 253 195 262 216 250" fill="none" stroke="${c.teal}"/>
      ${marker(245, 244, 28)}<rect x="293" y="244" width="33" height="35" rx="5" fill="${c.blue}"/><rect x="331" y="244" width="33" height="35" rx="5" fill="${c.rose}"/><path d="M291 239L328 209 366 239Z" fill="${c.sage}"/>
      <rect x="395" y="230" width="104" height="63" rx="9" fill="${c.teal}"/><rect x="403" y="238" width="88" height="45" rx="4" fill="${c.white}"/>
      <rect x="410" y="245" width="18" height="13" rx="3" fill="${c.gold}"/><rect x="438" y="245" width="18" height="13" rx="3" fill="${c.blue}"/><rect x="466" y="245" width="18" height="13" rx="3" fill="${c.rose}"/><path d="M413 272H480" fill="none" stroke="${c.violet}"/>
      ${plant(65, 325, 0.85)}${plant(578, 251, 0.59)}
      <path d="M330 83C308 67 310 49 326 49Q339 48 343 60Q350 47 363 52C380 60 366 80 343 96Z" fill="${c.rose}" stroke="none"/>`);
  }

  window.StudioArt = Object.freeze({ lesson, scene, welcome });
})();
