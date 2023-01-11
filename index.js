import {
  isMobileEnvironment,
  getRandomInt,
  checkVisible,
} from './utils.js';
import { renderDesktopAnimation } from './desktopAnimation.js';
import {
  showSkillProgress,
  revealSkills,
  loadSkillProgress,
} from './skillsAnimation.js';
import { skillsProgress, workText } from './infos.js';

let options = {
  strings: [workText],
  typeSpeed: 1,
  contentType: 'html',
  showCursor: false,
};

let isWorkAnimationStarted = false;
let isSkillProgressAnimationStarted = false;
let maxSkillProgress = 35;

const moveBackgroundImage = () => {
  let counter = 0;
  let goingRight = false;

  setInterval(() => {
    if (counter >= 380 && goingRight) {
      goingRight = false;
    }
    if (counter <= 0 && !goingRight) {
      goingRight = true;
    }

    counter += goingRight ? 1 : -1;

    document.getElementById(
      'image'
    ).style.marginLeft = `-${counter}px`;
  }, 20);
};

const main = () => {
  if (isMobileEnvironment) {
    maxSkillProgress = 18;
    moveBackgroundImage();
  } else {
    renderDesktopAnimation();
    window.addEventListener('scroll', revealSkills);
  }
  showSkillProgress(maxSkillProgress);
};

main();

const renderWorkAnimation = () => {
  const workIsVisible = checkVisible(document.getElementById('work'));

  if (
    workIsVisible &&
    !isWorkAnimationStarted &&
    !isMobileEnvironment
  ) {
    isWorkAnimationStarted = true;
    new Typed('.typed-work', options);
  }
};

const renderSkillProgressAnimation = () => {
  const isSkillProgressVisible = checkVisible(
    document.getElementById('skill-progress')
  );

  if (isSkillProgressVisible && !isSkillProgressAnimationStarted) {
    isSkillProgressAnimationStarted = true;
    for (let i = 0; i < skillsProgress.length; i++) {
      loadSkillProgress(maxSkillProgress, getRandomInt(0, 10), i);
    }
  }
};

const goToMovement = (target) => {
  let scrollContainer = target;
  let targetY = 0;

  do {
    scrollContainer = scrollContainer.parentNode;
    if (!scrollContainer) return;
    scrollContainer.scrollTop += 1;
  } while (scrollContainer.scrollTop == 0);

  do {
    if (target == scrollContainer) break;
    targetY += target.offsetTop;
  } while ((target = target.offsetParent));

  scroll = (c, a, b, i) => {
    i++;
    if (i > 30) return;
    c.scrollTop = a + ((b - a) / 30) * i;
    setTimeout(() => {
      scroll(c, a, b, i);
    }, 12);
  };

  scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
};

window.onscroll = () => {
  renderWorkAnimation();
  renderSkillProgressAnimation();
};

window.smoothScroll = (target) => {
  goToMovement(target);
};
