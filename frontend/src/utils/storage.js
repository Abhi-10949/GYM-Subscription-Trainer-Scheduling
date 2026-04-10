const AUTH_KEY = "gym_auth";
const AUTH_EVENT = "gym-auth-updated";
const THEME_KEY = "gym_theme";

export const saveAuth = (data) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const getAuth = () => {
  const value = localStorage.getItem(AUTH_KEY);
  return value ? JSON.parse(value) : null;
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const AUTH_UPDATED_EVENT = AUTH_EVENT;

export const getTheme = () => localStorage.getItem(THEME_KEY) || "dark";

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new Event("gym-theme-updated"));
};

export const THEME_UPDATED_EVENT = "gym-theme-updated";
