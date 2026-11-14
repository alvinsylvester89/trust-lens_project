(() => {
  "use strict";

  const THEME_KEY = "trustlens.theme.v1";
  const WORKSPACE_KEY = "trustlens.workspace.v1";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  function readTheme() {
    try {
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
      const workspace = JSON.parse(window.localStorage.getItem(WORKSPACE_KEY) || "null");
      if (workspace && (workspace.theme === "light" || workspace.theme === "dark")) return workspace.theme;
    } catch (error) {
      console.error("Could not restore TrustLens theme preference.", error);
    }
    return root.dataset.theme === "light" ? "light" : "dark";
  }

  function updateTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;
    root.dataset.theme = theme;
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "light"));
      toggle.setAttribute("aria-label", "Toggle light mode");
      toggle.title = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
      toggle.querySelector(".theme-icon").textContent = theme === "light" ? "☾" : "☀";
    }
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Could not save TrustLens theme preference.", error);
    }
  }

  function requestTheme(theme) {
    window.dispatchEvent(new CustomEvent("trustlens:themechange", { detail: { theme } }));
  }

  window.addEventListener("trustlens:themechange", event => {
    updateTheme(event.detail && event.detail.theme);
  });
  if (toggle) {
    toggle.addEventListener("click", () => {
      requestTheme(root.dataset.theme === "light" ? "dark" : "light");
    });
  }

  const initialTheme = readTheme();
  updateTheme(initialTheme);
  window.dispatchEvent(new CustomEvent("trustlens:themechange", { detail: { theme: initialTheme } }));
})();
