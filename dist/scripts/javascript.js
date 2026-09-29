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

const playPage = document.querySelector('[data-play]');

if (playPage) {
  const categoryButtons = [
    ...playPage.querySelectorAll('[data-category]')
  ];
  const allButton = playPage.querySelector('[data-all]');
  const choices = playPage.querySelector('.play-categories__choices');
  const tags = playPage.querySelector('[data-tags]');

  if (allButton && choices && tags) {
    // La catégorie cliquée le plus récemment apparaît en premier.
    const selected = [];

    function renderCategories() {
      const allSelected = selected.length === 0;

      allButton.setAttribute('aria-pressed', String(allSelected));
      choices.dataset.filtered = String(!allSelected);

      categoryButtons.forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(selected.includes(button.dataset.category))
        );
      });

      tags.replaceChildren();

      if (allSelected) {
        tags.textContent = '#tous';
        return;
      }

      selected.forEach((category) => {
        const item = document.createElement('span');
        item.className = 'play-challenge__tag';

        const name = document.createElement('span');
        name.textContent = `#${category}`;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'play-challenge__remove';
        remove.textContent = '×';
        remove.setAttribute(
          'aria-label',
          `Retirer la catégorie ${category}`
        );

        remove.addEventListener('click', () => {
          selected.splice(selected.indexOf(category), 1);
          renderCategories();
        });

        item.append(name, remove);
        tags.append(item);
      });
    }

    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        const index = selected.indexOf(category);

        if (index === -1) {
          selected.unshift(category);
        } else {
          selected.splice(index, 1);
        }

        renderCategories();
      });
    });

    allButton.addEventListener('click', () => {
      selected.length = 0;
      renderCategories();
    });

    renderCategories();
  }
}
const avatarPage = document.querySelector('[data-play]');

if (avatarPage) {
  const colorInputs = [
    ...avatarPage.querySelectorAll('input[name="ghost-color"]')
  ];
  const poseButtons = [
    ...avatarPage.querySelectorAll('[data-pose-choice]')
  ];
  const avatar = avatarPage.querySelector('.play-avatar');

  function updateAvatarDescription() {
    const color = colorInputs.find((input) => input.checked);
    const pose = poseButtons.find(
      (button) => button.dataset.poseChoice === avatarPage.dataset.pose
    );

    if (avatar && color && pose) {
      avatar.setAttribute(
        'aria-label',
        `Diablotin ${color.getAttribute('aria-label')}, ${pose.getAttribute('aria-label')}`
      );
    }
  }

  colorInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;

      avatarPage.dataset.color = input.value;
      updateAvatarDescription();
    });
  });

  poseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      avatarPage.dataset.pose = button.dataset.poseChoice;

      poseButtons.forEach((item) => {
        item.setAttribute(
          'aria-pressed',
          String(item === button)
        );
      });

      updateAvatarDescription();
    });
  });

  // Synchroniser l'affichage au chargement.
  const checkedColor = colorInputs.find((input) => input.checked);

  if (checkedColor) {
    avatarPage.dataset.color = checkedColor.value;
  }

  poseButtons.forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.poseChoice === avatarPage.dataset.pose)
    );
  });

  updateAvatarDescription();
}