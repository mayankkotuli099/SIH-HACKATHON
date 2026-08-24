/**
 * Theme Management for CrimeLens (Dark / Light Mode)
 */

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('crimelens_theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // Default to Cyber Dark
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('crimelens_theme', theme);
  window.dispatchEvent(new CustomEvent('crimelens-theme-change', { detail: theme }));
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getInitialTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
