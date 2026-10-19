/* One predictable set of destinations shared by the learner experiences. */
window.LearnerNav = (() => {
  const icons = {
    make: '<path d="M8 10a4 4 0 1 1 5-6 7 7 0 0 1 6 0 4 4 0 1 1 5 6v7a8 8 0 0 1-16 0Z"/><path d="M12 18q4 4 8 0"/><path d="M12 13h.01M20 13h.01"/>',
    stories: '<path d="M16 8C12 5 7 5 3 7v20c5-2 9-2 13 1 4-3 8-3 13-1V7c-4-2-9-2-13 1v20"/><path d="M7 12h5M20 12h5M7 17h5M20 17h5"/>',
    together: '<circle cx="9" cy="8" r="4"/><circle cx="23" cy="8" r="4"/><path d="M3 27v-8a6 6 0 0 1 12 0m2 0a6 6 0 0 1 12 0v8M9 19l7 5 7-5"/>',
  };
  const icon = id => `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[id]}</svg>`;
  function markup(active) {
    return `<nav class="learner-path" aria-label="Learner activities">${[
      ["make", "Make a Buddy", "#companion?view=make"],
      ["stories", "Read a Story", "#companion?view=stories"],
      ["together", "Practice Together", "#together?mode=learner&band=younger&cast=buddy"],
    ].map(([id, label, href]) => `<a href="${href}" ${id !== "together" ? `data-buddy-view="${id}"` : ""} ${active === id ? 'aria-current="page"' : ""}>${icon(id)}<span>${label}</span>${active === id ? '<span class="learner-current" aria-hidden="true">✓</span>' : ""}</a>`).join("")}</nav>`;
  }
  return { markup };
})();
