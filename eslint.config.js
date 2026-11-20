import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["client/dist/**", "node_modules/**"] },
  {
    files: ["client/src/**/*.{js,jsx}", "server/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["client/src/**/*.jsx"],
    rules: { "no-unused-vars": "off" }
  }
];
