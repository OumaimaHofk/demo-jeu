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