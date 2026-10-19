/* Original practice scripts. Sources inform the format, not predicted learner outcomes. */
window.TogetherData = (() => {
  const partners = [
    { id: "solo", label: "On my own", before: "Imagine both roles, use two objects, or read quietly. You can ask someone to join later.", prompt: "What might each person need? You do not have to agree with both people to hear them.", transfer: "Try one phrase with someone you trust, if you want. Imagining it is also practice." },
    { id: "parent", label: "Parent or caregiver", before: "Let the child choose the scene and whether to join. Model one line, then wait. Ask before offering advice.", prompt: "Would you like me to listen, help make a plan, or give you some time?", transfer: "Choose an ordinary moment, such as sharing art supplies. Ask what helped; let the child change the plan." },
    { id: "family", label: "Family member", before: "Invite words, languages, stories, and ways of caring familiar to your family. Ask what this situation might look like in your home.", prompt: "What do we already do in our family that could help here? Is there a phrase you would rather use?", transfer: "Choose a small family routine to practice together. Different family members may want different supports." },
    { id: "friend", label: "Friend", before: "Ask whether your friend wants to practice. Use made-up characters. Either person can pass, and personal stories stay optional.", prompt: "Would you like me to listen or help you think of another way? We can switch roles if you want.", transfer: "Agree on one phrase you can use together. A friend does not have to solve family problems; a trusted adult can help." },
    { id: "teacher", label: "Teacher or educator", before: "Model a fictional example first. Offer private rehearsal, writing, drawing, AAC, or optional partner practice. Do not grade feelings or require disclosure.", prompt: "What matters to each character? What else could they try? Which part would you change?", transfer: "Connect practice to a real classroom routine, then ask learners what helped. Notice strategies and access needs, not performances of emotion." },
  ];
  const scenes = [
    {
      id: "sharing", title: "One tool, two ideas", icon: "◇", skill: "Sharing & collaboration",
      young: "{a} and {b} both want the same blue marker. There is only one.",
      older: "{a} and {b} are making a group project. Both need the same tool and want to finish their part first.",
      places: { home: "At the kitchen table", school: "At the maker table", community: "At a community art activity" },
      a: "I have an idea I want to finish.", b: "I want a chance to use the tool, too.",
      plans: [
        { id: "turns", title: "Agree on turns", young: "Can I finish this part, then pass it to you?", older: "Could we agree on a stopping point, then switch?", listener: "Let’s choose a stopping point we both understand.", outcome: "They agree to switch after one small part. The second person still has to wait. They can check in if the wait feels too long.", question: "How could they make the turn-taking plan clear?" },
        { id: "another", title: "Find another way", young: "Could we use another color while we wait?", older: "Could one of us work on a different part while the tool is in use?", listener: "Let’s look at our options together.", outcome: "They find another part to work on. Their original ideas may need to change. Either person can say if the alternative does not work for them.", question: "What could stay the same, and what could change?" },
        { id: "help", title: "Ask for help making a plan", young: "Can someone help us make a plan?", older: "We both need this tool. Could someone help us find a fair plan?", listener: "I can listen to both ideas. What have you tried?", outcome: "A trusted adult helps them compare ideas. Getting help may take time, and the two makers still get a say in the plan.", question: "What would each maker want the helper to understand?" },
      ],
      offline: "Use two paper characters and one crayon to try a turn-taking plan. You can also imagine the scene without props.",
      connection: "Try before sharing materials in Animal Habitat Sorting or any Maker Studio project.",
    },
    {
      id: "space", title: "I need a little space", icon: "◌", skill: "Self-advocacy & sensory needs",
      young: "The room gets loud. {a} wants a quieter spot. {b} wants to keep playing together.",
      older: "During a group activity, the noise makes it hard for {a} to take part. {b} wants to keep working together and has not noticed the problem.",
      places: { home: "During a family activity", school: "During group work", community: "At a busy gathering" },
      a: "It is hard for me to join in with this much noise.", b: "I like doing this together. I did not know the noise was a problem.",
      plans: [
        { id: "quiet", title: "Ask for a quieter spot", young: "Can we play somewhere quieter?", older: "I want to take part. Could we find a quieter place?", listener: "Let’s look for a place that works for us.", outcome: "A quieter spot helps them continue together. It may not be available right away; they can ask a trusted adult about another option.", question: "What would make the new place work for each person?" },
        { id: "pause", title: "Take a pause", young: "I need a break. We can check in later.", older: "I need some time away from the noise. Can we agree how to check in?", listener: "You can take a break. Let’s make a check-in plan.", outcome: "They pause the activity. The group may need a new plan for the unfinished work. A pause does not have to make every feeling disappear.", question: "How could they check in without rushing anyone?" },
        { id: "support", title: "Choose a support", young: "Can someone help make it less loud?", older: "Could we lower the volume or choose another way for me to participate?", listener: "Which support would you like to try?", outcome: "They try lowering the sound or changing the activity. Different people need different supports; they can adjust if this one does not help.", question: "How will the person choosing the support know it is helping?" },
      ],
      offline: "With permission, point to or draw a place or support that makes participation easier. No need to recreate a loud situation.",
      connection: "Try before choosing textures or sounds in Tactile Storytelling & Sensory Boards.",
    },
    {
      id: "change", title: "The plan changed", icon: "↝", skill: "Transitions & asking for clarity",
      young: "{a} expected one activity. Now the plan is different. {b} is ready for the new activity.",
      older: "A plan changes with little warning. {a} needs more information and time. {b} assumes everyone is ready to move on.",
      places: { home: "When a home routine changes", school: "When the class schedule changes", community: "When an outing changes" },
      a: "I was counting on the first plan. I need to know what happens now.", b: "I am ready for the new plan. I did not realize someone needed more time.",
      plans: [
        { id: "ask", title: "Ask what happens next", young: "What will we do first? What comes next?", older: "Could you explain what changed, what stays the same, and what happens next?", listener: "Here is what we know. We can write or draw the next steps.", outcome: "They make the next steps clearer. Some details may still be unknown; it is okay to say so and agree when to check again.", question: "Which part would be most useful to know first?" },
        { id: "time", title: "Ask for time to get ready", young: "I need a little time before I start.", older: "Could I have a few minutes to prepare for this change?", listener: "Let’s see what time is available and what would help.", outcome: "They make room to prepare when possible. If there is a time limit, they can explain it and offer a smaller choice.", question: "What small choice might help if time is short?" },
        { id: "familiar", title: "Bring something familiar", young: "Can I keep one part the same?", older: "Could we keep a familiar routine or support as we change plans?", listener: "Which familiar part would help you?", outcome: "They keep one helpful part of the routine. The new plan may still feel disappointing. Listening can continue alongside the change.", question: "What familiar routine, words, or object could help?" },
      ],
      offline: "Draw a simple first–next plan for an everyday routine. Invite everyone involved to suggest one helpful choice.",
      connection: "Try before moving between planning, building, and reflecting in Maker Studio.",
    },
    {
      id: "belonging", title: "Room for another voice", icon: "○", skill: "Belonging & listening",
      young: "{a} wants to join a game. {b} is busy playing and does not notice.",
      older: "{a} has an idea for a group activity but keeps getting talked over. {b} is excited about their own idea and has not made space to listen.",
      places: { home: "During a shared activity at home", school: "During a small-group activity", community: "At a club or neighborhood activity" },
      a: "I want to have a part and be heard.", b: "I was focused on my own idea. I can make room to listen.",
      plans: [
        { id: "invite", title: "Ask for a turn to join", young: "Can I have a part in the game?", older: "I have an idea, too. Could we make room for everyone to contribute?", listener: "I’m listening. What part would you like to try?", outcome: "They make room for another contribution. People may still prefer different ideas, so listening does not mean everyone has to agree.", question: "How could everyone contribute without having to speak out loud?" },
        { id: "listen", title: "Practice being the listener", young: "I can stop and listen to your idea.", older: "I have been talking a lot. I would like to hear your idea in the way you want to share it.", listener: "Thank you. I can say it, write it, or show you.", outcome: "The listener makes space instead of guessing what someone feels. The other person can share or choose to pass.", question: "How could a listener show care without requiring eye contact?" },
        { id: "ally", title: "Ask someone to help include everyone", young: "Can someone help us make room?", older: "Could someone help us make a plan so everyone has a way to take part?", listener: "Let’s ask what each person needs to participate.", outcome: "A trusted adult or willing peer helps the group change its routine. The person left out is not responsible for fixing the whole group.", question: "What could the group change, instead of asking one person to change?" },
      ],
      offline: "Invite a willing partner to share an idea using words, drawing, gestures, or AAC. Ask what listening felt helpful to them.",
      connection: "Try while building a shared story map in Tactile Storytelling or planning any group project.",
    },
  ];
  const storyScenes = { sharing: "sharing", "safe-hands": "space", "ask-help": "space", feelings: "space", friends: "belonging", shadows: "change", cloud: "space", puddle: "space", cozy: "space" };
  const sceneFor = id => scenes.find(s => s.id === id) || null;
  const planFor = (sceneId, id) => sceneFor(sceneId)?.plans.find(p => p.id === id) || null;
  function options(hash = "") {
    const query = new URLSearchParams(hash.split("?")[1] || "");
    return { scene: sceneFor(query.get("scene"))?.id || null, band: query.get("band") === "younger" ? "younger" : "older", cast: query.get("cast") === "buddy" ? "buddy" : "people" };
  }
  // Each mount gets a fresh session. No drafts enter storage, URLs, or requests.
  function createSession(hash) {
    const initial = options(hash);
    const state = { ...initial, partner: "solo", place: "home", stage: 0, plan: null, swapped: false, line: "", reflection: "" };
    return {
      state,
      chooseScene(id) { if (!sceneFor(id)) return false; Object.assign(state, { scene: id, stage: 0, plan: null, swapped: false, line: "", reflection: "" }); return true; },
      choosePlan(id) { if (!planFor(state.scene, id)) return false; state.plan = id; state.swapped = false; return true; },
      next() { if (!planFor(state.scene, state.plan) || state.stage >= 2) return false; state.stage++; return true; },
      back() { state.stage = Math.max(0, state.stage - 1); },
      write(key, text) { if (!["line", "reflection"].includes(key)) return; state[key] = String(text).slice(0, 600); },
      clear() { Object.assign(state, { scene: null, stage: 0, plan: null, swapped: false, line: "", reflection: "" }); },
    };
  }
  return { scenes, partners, storyScenes, sceneFor, planFor, createSession, options };
})();
