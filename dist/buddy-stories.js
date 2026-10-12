/* Original, child-directed SEL stories. No scoring, required imitation, or disclosure prompts. */
window.BuddyStories = {
  topics: [
    ["all", "✧", "All stories"],
    ["calm", "☁", "Calming my body"],
    ["sharing", "◇", "Sharing & turns"],
    ["safety", "♡", "Safe hands & help"],
    ["feelings", "☀", "My feelings"],
    ["friends", "⌂", "Being a friend"],
    ["curiosity", "?", "Things I wonder"],
  ],
  stories: [
    {
      id: "sharing", topic: "sharing", title: "One blue block", theme: "garden",
      skill: "Ask for a turn. Make a plan together.", poses: ["blocks", "ask-friend", "share", "build"],
      scenes: [
        ["One block, two ideas", "{name} wants the blue block. A friend is using it. Both friends have an idea to build.", "It is okay to want a turn."],
        ["Ask, then listen", "{name} asks, “May I have a turn when you are done?” The friend says, “After my little bridge.”", "You can ask with words, a picture, or a gesture."],
        ["A plan for waiting", "{name} uses a different block for now. When the bridge is ready, the friend offers the blue block.", "Waiting can feel hard. A grown-up can help make a plan."],
        ["Build together", "{name} asks, “Shall we join our buildings?” The friend says yes. Their two ideas become a little town.", "You can take turns, build together, or play side by side."],
      ],
    },
    {
      id: "safe-hands", topic: "safety", title: "Paws can pause", theme: "garden",
      skill: "Big feelings are okay. Keep bodies safe.", poses: ["blocks", "pause", "ask", "build"],
      scenes: [
        ["The tower tumbles", "The tower falls. {name} feels angry. Their paws feel tight. Feeling angry is okay. Hitting can hurt.", "All feelings belong. We can get help with what we do."],
        ["A little space", "{name} steps back and rests their paws on their own tummy. There is space between the two friends.", "You can rest your hands or hold a soft toy."],
        ["Tell a grown-up", "{name} says to a trusted grown-up, “I feel angry. Please help me keep my hands safe.” The grown-up stays nearby.", "Speaking, pointing, signing, or using your talker all count."],
        ["Ready in my own time", "The grown-up helps. {name} chooses to rest, then build again. If someone was hurt, they check what that person needs.", "You do not have to fix a big feeling all by yourself."],
      ],
    },
    {
      id: "ask-help", topic: "safety", title: "My words matter", theme: "stars",
      skill: "Tell a trusted grown-up when you need help.", poses: ["pause", "ask", "listen-helper", "ask"],
      scenes: [
        ["I need some space", "Someone is playing too roughly. {name} does not like it. Their body belongs to them. They can move toward help.", "You can say “Stop” or move away if you can."],
        ["Find a helper", "{name} finds a trusted grown-up. “I need help. The play is hurting me.” They can also point or use a picture.", "You do not need perfect words to ask for help."],
        ["A grown-up listens", "The grown-up listens to {name} and helps make space. “Thank you for telling me,” they say. “Keeping you safe is my job.”", "You deserve help and care."],
        ["Keep asking for help", "{name} knows: if someone hurts me, it is not my fault. If I still need help, I can tell another trusted grown-up.", "You may talk to a trusted grown-up whenever you need to."],
      ],
    },
    {
      id: "feelings", topic: "feelings", title: "A name for my feeling", theme: "pond",
      skill: "Notice a feeling. Choose what might help.", poses: ["notice", "pause", "ask", "wave"],
      scenes: [
        ["Something feels different", "{name} arrives at the pond. Their tummy feels fluttery. They are not sure what this feeling is yet.", "You do not have to know the name of every feeling."],
        ["A word, or a picture", "{name} looks at feeling pictures. “Maybe I feel worried,” they say. More than one feeling can be here at once.", "You can point, draw, talk, or just notice."],
        ["What might help?", "{name} asks a trusted grown-up to stay close. They choose a quiet spot where they can see the pond.", "You can ask for company, space, or another kind of support."],
        ["Still me", "The feeling may stay or change. {name} is still the same caring buddy. Every feeling deserves a little kindness.", "There is no right feeling to have at the end of a story."],
      ],
    },
    {
      id: "friends", topic: "friends", title: "A place for a friend", theme: "garden",
      skill: "Invite kindly. Respect a friend's choice.", poses: ["wave", "ask-friend", "listen", "share"],
      scenes: [
        ["Someone nearby", "{name} sees a friend near the garden. They want to invite the friend to play, but they do not know what to say.", "A small hello can be a beginning."],
        ["An invitation", "{name} asks, “Would you like to build with me?” The friend says, “I want to watch first.”", "You can invite with a picture or a gesture, too."],
        ["Room to choose", "“That is okay,” says {name}. They leave a little space nearby. Friends can enjoy different ways of joining in.", "A friend can say yes, no, or not yet."],
        ["Our own way to play", "Later, the friend chooses a block. {name} makes room. They build side by side, each at their own pace.", "Being together does not have to mean doing the same thing."],
      ],
    },
    {
      id: "shadows", topic: "curiosity", title: "The shadow question", theme: "garden",
      skill: "Wonder about shadows. Ask, try, and learn.", poses: ["shadow", "ask", "shadow", "share"],
      scenes: [
        ["What is that shape?", "{name} notices a shadow beside a block. “How did that get there?” Wondering is a way to begin learning.", "What do you notice in the picture? You can just look."],
        ["Ask a question", "{name} asks a grown-up. “A shadow forms when something blocks light,” they say. They find a flashlight to explore together.", "We can ask for help with things we do not know yet."],
        ["Try another way", "{name} moves the block in front of the light. The shadow changes. A first try can lead to another question.", "With a grown-up, try a block and a light. Keep light away from eyes."],
        ["Share a discovery", "“I made a new shape!” says {name}. Their friend tries too. They take turns noticing. Learning can happen together.", "Draw a discovery or tell someone what you wonder next."],
      ],
    },
    {
      id: "cloud", topic: "calm", title: "The little cloud garden", theme: "garden",
      skill: "A comfortable breath, at your own pace.", poses: ["notice", "breathe", "breathe", "pause"],
      scenes: [
        ["A busy little morning", "{name} has lots of fluttery feelings. We can slow down together.", "You can just watch, too."],
        ["Hello, little flower", "{name} notices a flower. If you like, take one comfortable breath in.", "No big breath needed."],
        ["A cloud floats by", "{name} lets the breath out gently, like a cloud drifting away.", "Let your body choose its pace."],
        ["A place to stay", "{name} rests beside the flowers. Every feeling is welcome here.", "Rest, watch again, or ask a grown-up to sit with you."],
      ],
    },
    {
      id: "puddle", topic: "calm", title: "Paws by the peaceful pond", theme: "pond",
      skill: "Feel your feet. Let your shoulders soften.", poses: ["notice", "pause", "stretch", "pause"],
      scenes: [
        ["Wiggly paws", "{name} feels wiggly after a big day. There is time for a little pause.", "Sitting or standing is okay."],
        ["Hello, ground", "{name} notices the ground. If comfortable, feel your feet or your seat.", "You can choose any comfy position."],
        ["Soft little shoulders", "{name} lifts their shoulders a little, then lets them soften.", "Only move if it feels good to you."],
        ["Ripples settle", "{name} watches a ripple. You do not have to do anything right now.", "Your body can rest in its own way."],
      ],
    },
    {
      id: "cozy", topic: "calm", title: "The cozy blanket hideaway", theme: "stars",
      skill: "Choose comfort and ask for a little help.", poses: ["notice", "pause", "ask", "listen-helper"],
      scenes: [
        ["A lot to notice", "The day feels a little too busy for {name}. A quiet place might help.", "It is okay to want less noise or light."],
        ["Make a cozy space", "{name} chooses a soft spot. You can choose what feels comfortable.", "A cushion, a quiet corner, or some space."],
        ["A helping hand", "{name} asks a trusted grown-up, “Will you sit with me?”", "You can ask with words, a picture, or a gesture."],
        ["Together for a while", "{name} settles in. There is no hurry to feel a different way.", "We can stay here for a little while."],
      ],
    },
  ],
};
