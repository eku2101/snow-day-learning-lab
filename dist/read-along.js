/* Speech-event-driven highlighting. Cancellation invalidates every stale callback.
   Word mode works without boundary events; smooth mode uses native word boundaries. */
window.BuddyReadAlong = (() => {
  const words = text => Array.from(text.matchAll(/\S+/gu), match => ({ text: match[0], start: match.index }));
  function create({ synth = window.speechSynthesis, Utterance = window.SpeechSynthesisUtterance,
    onHighlight = () => {}, onState = () => {}, onMessage = () => {} } = {}) {
    let text = "", tokens = [], index = 0, state = "idle", generation = 0;
    let mode = "words", rate = 0.8, current = null, watchdog = null;
    const supported = !!(synth && Utterance);
    const setState = next => { state = next; onState(next); };
    function cancel() {
      generation++;
      clearTimeout(watchdog);
      if (current) current.onstart = current.onend = current.onerror = current.onboundary = null;
      current = null;
      if (supported) synth.cancel();
    }
    function fail() {
      cancel();
      onHighlight(-1, -1);
      setState("paused");
      onMessage("The voice is not available right now. You can try again or read with a grown-up.");
    }
    function speakNext() {
      if (index >= tokens.length) {
        current = null;
        onHighlight(-1, -1);
        setState("done");
        onMessage("You reached the end of this page. Read again or choose Next when you are ready.");
        return;
      }
      const start = index;
      let end = start;
      // Short sentences keep smooth speech responsive to pauses and navigation.
      if (mode === "smooth") {
        while (end < tokens.length - 1 && !/[.!?][”’"')]*$/u.test(tokens[end].text)) end++;
      }
      const base = tokens[start].start;
      const utterance = new Utterance(text.slice(base, tokens[end].start + tokens[end].text.length));
      current = utterance; // Retain a strong reference while the browser speaks.
      utterance.lang = "en-US";
      utterance.rate = rate;
      const voices = synth.getVoices?.() || [];
      utterance.voice = voices.find(v => v.localService && /^en[-_]/i.test(v.lang)) ||
        voices.find(v => /^en[-_]/i.test(v.lang)) || null;
      const ticket = generation;
      const valid = () => ticket === generation && state === "reading";
      let wordBoundary = false;
      utterance.onstart = () => {
        if (!valid()) return;
        clearTimeout(watchdog);
        // No estimated timers: each highlighted word/phrase corresponds to real speech.
        onHighlight(start, end);
      };
      utterance.onboundary = event => {
        if (!valid() || mode !== "smooth" || event.name !== "word") return;
        wordBoundary = true;
        const character = base + event.charIndex;
        let at = start;
        while (at < end && tokens[at + 1].start <= character) at++;
        index = at;
        onHighlight(at, at);
      };
      utterance.onend = () => {
        if (!valid()) return;
        clearTimeout(watchdog);
        if (mode === "smooth" && !wordBoundary && end > start)
          onMessage("This voice follows a sentence at a time. Choose Word by word to highlight every spoken word.");
        index = end + 1;
        speakNext();
      };
      utterance.onerror = () => { if (valid()) fail(); };
      watchdog = setTimeout(() => { if (valid()) fail(); }, 12000);
      try { synth.speak(utterance); } catch { fail(); }
    }
    return {
      supported,
      load(value, options = {}) {
        cancel(); text = value; tokens = words(value); index = 0;
        mode = options.mode === "smooth" ? "smooth" : "words";
        rate = Math.min(1.5, Math.max(0.5, Number(options.rate) || 0.8));
        onHighlight(-1, -1); setState("idle");
      },
      play() {
        if (!supported) {
          onMessage("This browser has no reading voice. The words are here to read together with a grown-up.");
          return;
        }
        if (state === "reading" || !tokens.length) return;
        if (state === "done") index = 0;
        cancel(); setState("reading");
        onMessage("Follow the highlighted words. Pause whenever you like.");
        speakNext();
      },
      pause() {
        if (state !== "reading") return;
        cancel(); setState("paused");
        onMessage("Paused. We can take our time.");
      },
      setRate(value) { rate = Math.min(1.5, Math.max(0.5, Number(value) || 0.8)); },
      stop() { cancel(); index = 0; onHighlight(-1, -1); setState("idle"); },
      get state() { return state; },
    };
  }
  return { words, create };
})();
