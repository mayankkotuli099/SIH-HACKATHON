/**
 * Theme Management for CrimeLens — Centralized Dual Theme System
 * Supports Pure Light Forensics Theme (Default) and Layered Dark Forensics Theme
 */

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('crimelens_theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch (e) {}
  return 'light';
}

export function applyTheme(theme = 'light') {
  if (typeof document === 'undefined') return theme;
  const targetTheme = theme === 'dark' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', targetTheme);
  if (targetTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem('crimelens_theme', targetTheme);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crimelens-theme-change', { detail: targetTheme }));
  }

  return targetTheme;
}

export function toggleTheme() {
  const current = getInitialTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  return applyTheme(next);
}
