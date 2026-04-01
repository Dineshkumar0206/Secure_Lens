const STORAGE_KEY = "securelens-theme";

const themeDefinitions = {
  dark: {
    label: "Midnight",
    preview: "linear-gradient(135deg, #0b1224 0%, #050b16 100%)",
  },
  light: {
    label: "Daylight",
    preview: "linear-gradient(135deg, #f7f8fb 0%, #dde6f3 100%)",
  },
  aurora: {
    label: "Aurora",
    preview: "linear-gradient(135deg, #0c0e19 0%, #3c1265 100%)",
  },
  sunrise: {
    label: "Sunrise",
    preview: "linear-gradient(135deg, #15070d 0%, #3d1f32 100%)",
  },
};

const THEME_ORDER = Object.keys(themeDefinitions);
const DEFAULT_THEME = THEME_ORDER[0];

const themeExists = (value) => themeDefinitions[value];

export const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && themeExists(stored)) {
    return stored;
  }
  return DEFAULT_THEME;
};

export const applyTheme = (theme) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
};

export const getThemeOptions = () =>
  THEME_ORDER.map((value) => ({ value, ...themeDefinitions[value] }));

export const setTheme = (theme) => {
  const next = themeExists(theme) ? theme : DEFAULT_THEME;
  applyTheme(next);
  return next;
};

export const cycleTheme = () => {
  const current = getStoredTheme();
  const currentIndex = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
  applyTheme(next);
  return next;
};

export const toggleTheme = cycleTheme;

export const initializeTheme = () => {
  setTheme(getStoredTheme());
};

export const getActiveTheme = () => {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }
  return document.documentElement.dataset.theme || getStoredTheme();
};
