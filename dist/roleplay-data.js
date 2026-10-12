/* Original writing invitations, not an assessment or a personalized counseling service. */
window.RoleplayData = (() => {
  const bands = [
    ["upper", "Grades 4–6", "Short, concrete starters"],
    ["middle", "Grades 7–9", "More room for mixed feelings"],
    ["high", "Grades 10–12", "Needs, boundaries, and next steps"],
  ];
  const scenarios = [
    { id: "family", icon: "⌂", title: "Family changes or divorce", summary: "Changes at home, different routines, or missing someone.",
      opening: "There have been changes at home. What would you like a trusted adult to understand?",
      reminder: "A separation or divorce is an adult decision. You did not cause it, and it is not your job to fix it or choose sides.",
      starts: {
        upper: ["When things change at home, I feel", "One thing that helps me feel settled is", "Could you please help me with"],
        middle: ["With the changes in my family, I have been feeling", "Something I want to keep steady in my life is", "I would like to ask a trusted adult for"],
        high: ["As I make sense of the family changes, I have been feeling", "A routine or boundary that would support me is", "One specific thing I would like us to discuss is"],
      },
      ideas: [["unsure about what will happen next", "sad and relieved at different times", "frustrated when plans change"], ["knowing the plan for the week", "time with someone who listens", "a familiar routine"], ["explaining the next change ahead of time", "listening without asking me to take sides", "finding a time to talk privately"]],
      reply: "Thank you for saying what you want understood. These changes are not yours to fix. What would help you feel supported?",
    },
    { id: "school", icon: "▤", title: "School feels overwhelming", summary: "A big workload, a busy classroom, or asking for support.",
      opening: "Imagine a teacher or trusted adult has time to listen. What has felt difficult at school?",
      reminder: "Needing support does not say anything bad about your effort or ability.",
      starts: {
        upper: ["At school, I feel frustrated when", "Something that helps me learn is", "Could we try"],
        middle: ["Lately, school has felt overwhelming because", "A support that would make it easier to begin is", "Could we make a plan for"],
        high: ["At school, I feel overwhelmed when", "An adjustment that would help me participate is", "I would like to discuss a manageable next step for"],
      },
      ideas: [["several things are due at once", "the room is too noisy", "I do not know where to start"], ["one clear step at a time", "a quieter place to work", "written directions I can revisit"], ["choosing the first task together", "a short break before I continue", "checking that I understand the directions"]],
      reply: "Thank you for explaining what feels difficult. What helps you get started or participate?",
    },
    { id: "friendship", icon: "◇", title: "A friendship feels difficult", summary: "Feeling left out, a disagreement, or making room for different needs.",
      opening: "Imagine a conversation about a friendship. What do you want someone to understand about your experience?",
      reminder: "You can ask for care and respect. You do not have to stay in a conversation that feels unsafe.",
      starts: {
        upper: ["I feel left out or upset when", "A way I like to spend time with friends is", "Could we"],
        middle: ["Something that has been bothering me in our friendship is", "What helps me feel included is", "I would like to ask for"],
        high: ["I want to explain how this situation has affected me:", "A boundary or expectation that matters to me is", "One way I would like us to move forward is"],
      },
      ideas: [["plans change without anyone telling me", "my ideas are talked over", "a joke does not feel funny to me"], ["having time to finish what I am saying", "being invited without pressure", "spending time in a quieter place"], ["checking before making a joke about me", "making room for both of our ideas", "taking a break and talking later"]],
      reply: "Thank you for explaining your experience. What would care or respect look like to you?",
    },
    { id: "space", icon: "☁", title: "I need a break or some space", summary: "Big feelings, sensory overload, or time to think.",
      opening: "You can practice asking for space without explaining every detail. What would you like to say?",
      reminder: "A pause can be a useful choice. You can decide what a comfortable break looks like with a trusted adult.",
      starts: {
        upper: ["I notice I need a pause when", "A place or activity that helps me pause is", "Could I have"],
        middle: ["I notice that I need a pause when", "During a break, what works for me is", "I would like to ask for"],
        high: ["I am finding it difficult to stay in this conversation because", "A support that would help me take care of myself is", "Could we agree on"],
      },
      ideas: [["too many things are happening at once", "I need more time to find my words", "my body feels tense"], ["a quiet place with less noise", "writing before I talk", "having someone nearby without questions"], ["a few quiet minutes", "a plan to return to the conversation later", "time to write down what I want to say"]],
      reply: "You can take time to find your words. What would a useful pause look like for you?",
    },
    { id: "heard", icon: "↗", title: "I want to feel heard", summary: "Talking with a grown-up about a frustration or a different point of view.",
      opening: "Think of someone you would like to understand you better. What do you want to put into words?",
      reminder: "Your experience matters, even when people understand a situation differently.",
      starts: {
        upper: ["I wish you knew that", "It helps me talk when", "Could you please"],
        middle: ["One thing I have not been able to explain is", "I feel listened to when", "What I would like from this conversation is"],
        high: ["The part of my experience I want to make visible is", "A way we could understand each other better is", "A specific request I want to make is"],
      },
      ideas: [["I may need time before I can explain", "being quiet does not mean I do not care", "I see this differently"], ["I can finish without being interrupted", "someone asks before offering advice", "I can share a written note"], ["listening to my whole thought first", "asking what kind of support I want", "making time for a private conversation"]],
      reply: "Thank you for putting that into words. What helps you feel listened to?",
    },
    { id: "own", icon: "✎", title: "Something on my mind", summary: "Use a made-up situation or explore a topic of your own.",
      opening: "You decide what this practice is about. It can be real, imagined, or just one small thought.",
      reminder: "You choose what to share. Names and private details are not needed for practice.",
      starts: {
        upper: ["Something on my mind is", "Something that helps me is", "I would like to ask for"],
        middle: ["What I want someone to understand is", "A strength, routine, or person I can draw on is", "One next step I would like support with is"],
        high: ["One experience I want to put into words is", "Something from my life or community that supports me is", "A request or boundary I want to communicate is"],
      },
      ideas: [["something I am not ready to explain fully", "a change I am still getting used to", "a question I do not know how to ask"], ["a routine that feels familiar", "someone who understands my language or culture", "a way my family cares for one another"], ["someone to listen", "time to think before deciding", "help with one small next step"]],
      reply: "Thank you for sharing the part you chose. What would support you in this situation?",
    },
  ];
  const steps = ["What I’m feeling", "What helps me", "What I want to ask"];
  function starters(scenario, band, step) {
    const grade = bands.some(b => b[0] === band) ? band : "middle";
    return [scenario.starts[grade][step], ["Another way to describe it is", "In my family or community, a way we care for each other is", "A question I want to ask is"][step], ""];
  }
  function compose(prefix, draft) {
    const value = String(draft || "").trim();
    if (!value) return "";
    return `${prefix ? prefix + " " : ""}${value}`;
  }
  return { bands, scenarios, steps, starters, compose };
})();
