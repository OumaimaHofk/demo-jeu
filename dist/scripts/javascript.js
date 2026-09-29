const ghost = document.querySelector('.ghost');
const cultissime = document.querySelector('.cultissime');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (ghost && cultissime && !reducedMotion.matches) {
  let frameRequested = false;

  function updateGhostPosition() {
    const rectangle = cultissime.getBoundingClientRect();
    const sectionCenter = rectangle.top + rectangle.height / 2;
    const viewportCenter = window.innerHeight / 2;

    const shift = Math.max(
      -30,
      Math.min(30, (viewportCenter - sectionCenter) * 0.1)
    );

    ghost.style.setProperty('--ghost-shift', `${shift}px`);
    frameRequested = false;
  }

  function requestPositionUpdate() {
    if (frameRequested) return;

    frameRequested = true;
    requestAnimationFrame(updateGhostPosition);
  }

  window.addEventListener('scroll', requestPositionUpdate, {
    passive: true
  });
  window.addEventListener('resize', requestPositionUpdate);

  requestPositionUpdate();
}

const answer = document.querySelector('.quote-card__answer');
const revealButtons = document.querySelectorAll(
  '.quote-card__hint, .quote-card__button'
);

if (answer) {
  revealButtons.forEach((button) => {
    button.addEventListener('click', () => {
      answer.hidden = false;

      revealButtons.forEach((revealButton) => {
        revealButton.hidden = true;
      });
    });
  });
}

const playerName = document.querySelector('#player-name');
const startButton = document.querySelector('[data-start]');

if (playerName && startButton) {
  function updateStartButton() {
    startButton.disabled = playerName.value.trim() === '';
  }

  playerName.addEventListener('input', updateStartButton);
  updateStartButton();
}

const podiumTimer = document.querySelector('[data-podium-timer]');

if (podiumTimer) {
  const hoursElement = podiumTimer.querySelector('[data-hours]');
  const minutesElement = podiumTimer.querySelector('[data-minutes]');
  const secondsElement = podiumTimer.querySelector('[data-seconds]');

  function updatePodiumTimer() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const remaining = Math.floor((nextMidnight - now) / 1000);
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }

  updatePodiumTimer();
  setInterval(updatePodiumTimer, 1000);
}