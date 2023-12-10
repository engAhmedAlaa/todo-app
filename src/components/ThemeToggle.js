import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from './Icons';

function getTheme() {
  if (localStorage.getItem('theme')) return localStorage.getItem('theme');
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleClickThemeToggle() {
    setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  document.documentElement.className = theme === 'dark' ? 'dark' : '';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClickThemeToggle}
      aria-label="Toggle theme"
    >
      <SunIcon className="sun icon" />
      <MoonIcon className="moon icon" />
    </button>
  );
}

export default ThemeToggle;
