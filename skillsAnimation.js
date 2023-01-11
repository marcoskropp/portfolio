import {
  generateInitialSkillProgress,
  generateTextLoadSkillProgress,
} from './generators.js';
import { skillsProgress } from './infos.js';
import { isMobileEnvironment } from './utils.js';

const showSkillProgress = (maxSkillProgress) => {
  for (let i = 0; i < skillsProgress.length; i++) {
    let progressText = generateInitialSkillProgress(maxSkillProgress);
    const progressContainer = document.createElement('div');

    if (isMobileEnvironment) {
      progressContainer.className =
        i % 2
          ? 'skill-container reveal-right active'
          : 'skill-container reveal-left active';
    } else {
      progressContainer.className =
        i % 2
          ? 'skill-container reveal-right'
          : 'skill-container reveal-left';
    }

    const skillName = document.createElement('p');
    skillName.className = 'skill-name';
    const skillProgress = document.createElement('p');
    skillProgress.className = 'skill-progress';
    skillProgress.id = skillsProgress[i].id;

    skillName.innerHTML = skillsProgress[i].skill;
    skillProgress.innerHTML = progressText;

    const element = document.getElementById('skill-progress');
    progressContainer.appendChild(skillName);
    progressContainer.appendChild(skillProgress);
    element.appendChild(progressContainer);
  }
};

const loadSkillProgress = (
  maxSkillProgress,
  actualProgress,
  index
) => {
  setTimeout(() => {
    let skillProgress = document.getElementById(
      skillsProgress[index].id
    );

    const progressValue = Math.floor(
      (maxSkillProgress * skillsProgress[index].value) / 100
    );

    let text = generateTextLoadSkillProgress(
      actualProgress,
      maxSkillProgress
    );

    actualProgress++;
    skillProgress.innerHTML = text;

    if (actualProgress < progressValue)
      loadSkillProgress(maxSkillProgress, actualProgress, index);
  }, 200);
};

const revealSkills = () => {
  let revealsRight = document.querySelectorAll('.reveal-right');
  let revealsLeft = document.querySelectorAll('.reveal-left');

  for (let i = 0; i < revealsRight.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = revealsRight[i].getBoundingClientRect().top;
    let elementVisible = 50;

    if (elementTop < windowHeight - elementVisible) {
      revealsRight[i].classList.add('active');
    } else {
      revealsRight[i].classList.remove('active');
    }
  }

  for (let i = 0; i < revealsLeft.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = revealsLeft[i].getBoundingClientRect().top;
    let elementVisible = 50;

    if (elementTop < windowHeight - elementVisible) {
      revealsLeft[i].classList.add('active');
    } else {
      revealsLeft[i].classList.remove('active');
    }
  }
};

export { showSkillProgress, loadSkillProgress, revealSkills };
