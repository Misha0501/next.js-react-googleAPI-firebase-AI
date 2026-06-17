import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  // Must be last: turns off ESLint rules that conflict with Prettier
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "generated/**"]),
]);
