/* Purpose: single source of static application configuration. */
export const CONFIG = Object.freeze({
  appName: "AI Prompt Vault",
  version: "1.0.0",
  pageSize: 8,
  defaultLanguage: "en",
  defaultTheme: "purple",
  maxHistory: 50,
  maxFavorites: 100,
  maxUnlocks: 200,
  adProvider: "provider-adapter",
  telegramBotUsername: "",
  supportUrl: "",
  privacyUrl: "#/profile",
  termsUrl: "#/profile"
});
