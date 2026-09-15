const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const languageToggle = document.querySelector('#language-toggle');

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
});
