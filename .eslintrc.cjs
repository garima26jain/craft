module.exports = {
  // Specify the root of the configuration
  root: true,
  // Define the environment
  env: {
    browser: true, // Enable browser global variables
    es2020: true, // Enable ES2020 syntax
  },
  // Extend recommended ESLint configurations
  extends: [
    "eslint:recommended", // Use recommended ESLint rules
    "plugin:@typescript-eslint/recommended", // Use recommended rules from @typescript-eslint
    "plugin:react-hooks/recommended", // Use recommended rules for React hooks
  ],
  // Ignore specific patterns
  ignorePatterns: ["dist", ".eslintrc.cjs"], // Ignore the dist directory and .eslintrc.cjs file
  // Specify the parser for TypeScript
  parser: "@typescript-eslint/parser",
  // Define the plugins used
  plugins: [
    "react-refresh", // Plugin for React Fast Refresh
  ],
  // Define custom rules
  rules: {
    "react-refresh/only-export-components": [
      "warn", // Warn when components are not exported correctly for React Refresh
      { allowConstantExport: true }, // Allow constant exports
    ],
  },
};
