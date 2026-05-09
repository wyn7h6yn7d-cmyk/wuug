import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Intentionally removed from current UX scope:
    "app/(platform)/reports/**",
    "components/providers/role-provider.tsx",
    "components/settings/**",
    "app/(platform)/team/**",
    "components/promises/**",
    "components/reports/**",
  ]),
  {
    rules: {
      // Keep lint useful, but avoid blocking builds on React Compiler-specific heuristics.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
]);

export default eslintConfig;
