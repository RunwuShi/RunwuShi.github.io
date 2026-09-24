const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const languageToggle = document.querySelector('#language-toggle');
const projectItems = [...document.querySelectorAll('.project-item')];
const projectList = document.querySelector('.project-list');
const projectPagination = document.querySelector('.project-pagination');

function setTheme(isDark) {
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode',
  );
  themeToggle.setAttribute(
    'title',
    isDark ? 'Switch to light mode' : 'Switch to dark mode',
  );
}

function setLanguage(lang) {
  root.dataset.lang = lang;
  root.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  localStorage.setItem('language', lang);
}

const preferredTheme = localStorage.getItem('theme');
setTheme(preferredTheme === 'dark');

setLanguage(localStorage.getItem('language') === 'zh' ? 'zh' : 'en');

themeToggle.addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'));
});

languageToggle.addEventListener('click', () => {
  setLanguage(root.dataset.lang === 'zh' ? 'en' : 'zh');
  requestAnimationFrame(updateProjectListHeight);
});

const projectsPerPage = 3;
const projectPageCount = Math.ceil(projectItems.length / projectsPerPage);
let currentProjectPage = 0;

function showProjectPageItems(pageIndex) {
  projectItems.forEach((item, index) => {
    const isVisible = Math.floor(index / projectsPerPage) === pageIndex;
    item.hidden = !isVisible;
    item.classList.toggle('project-page-first', isVisible && index % projectsPerPage === 0);
  });
}

function setProjectPage(pageIndex) {
  currentProjectPage = pageIndex;
  showProjectPageItems(pageIndex);

  projectPagination.querySelectorAll('button').forEach((button, index) => {
    const isCurrent = index === pageIndex;
    button.setAttribute('aria-current', isCurrent ? 'page' : 'false');
  });
}

function updateProjectListHeight() {
  if (!projectList || projectPageCount <= 1) return;

  projectList.style.minHeight = '';
  let tallestPage = 0;

  for (let pageIndex = 0; pageIndex < projectPageCount; pageIndex += 1) {
    showProjectPageItems(pageIndex);
    tallestPage = Math.max(tallestPage, projectList.offsetHeight);
  }

  projectList.style.minHeight = `${tallestPage}px`;
  setProjectPage(currentProjectPage);
}

if (projectPagination && projectPageCount > 1) {
  for (let pageIndex = 0; pageIndex < projectPageCount; pageIndex += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(pageIndex + 1);
    button.setAttribute('aria-label', `Project page ${pageIndex + 1}`);
    button.addEventListener('click', () => setProjectPage(pageIndex));
    projectPagination.append(button);
  }

  setProjectPage(0);
  requestAnimationFrame(updateProjectListHeight);

  let projectResizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(projectResizeFrame);
    projectResizeFrame = requestAnimationFrame(updateProjectListHeight);
  });
} else if (projectPagination) {
  projectPagination.hidden = true;
}
