const earnedBadges = {
  teamBuilder: { label: "Team Builder", emoji: "🤝", level: 2, type: "collaborator", locked: false },
  ethicsLeader: { label: "Ethics Leader", emoji: "⚖️", level: 3, type: "ethical", locked: false },
  innovator: { label: "Innovator", emoji: "💡", level: 1, type: "innovator", locked: false },
  unknown: { label: "Ethics Leader", emoji: "⚖️", level: 0, type: "ethical", locked: true }
};

function toggleBadgeTracker() {
  const panel = document.getElementById("badgePanel");
  if (panel) {
    const isVisible = panel.style.display === "block";
    panel.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      renderCircularBadges(earnedBadges);
    }
  }
}

function renderCircularBadges(badgeData = {}) {
  const tracker = document.getElementById("badgeTracker");
  if (!tracker) return;

  tracker.innerHTML = "";

  Object.entries(badgeData).forEach(([key, badge]) => {
    const { label, emoji, level, type, locked } = badge;

    const badgeEl = document.createElement("div");
    badgeEl.className = `circular-badge badge-${type} ${locked ? "locked" : "unlocked"}`;
    if (!locked && level >= 3) badgeEl.classList.add("glow");

    badgeEl.innerHTML = \`
      \${emoji}
      <span class="label">\${label}</span>
      <span class="level">\${locked ? "Locked" : \`Level \${level}\`}</span>
    \`;

    tracker.appendChild(badgeEl);
  });
}