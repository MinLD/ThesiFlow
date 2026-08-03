import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "**/node_modules/**", "dist/**", "**/dist/**", ".next/**", "**/.next/**", "coverage/**", "**/coverage/**", "apps/api/src/generated/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  {
    files: ["apps/api/src/modules/auth/**/*.service.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["**/database/prisma"]
        }
      ]
    }
  }
];
