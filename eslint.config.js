import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "dist/**", "node_modules/**"]),
  {
    rules: {
      // Existing data providers synchronize API responses into client state.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      // Property image URLs are supplied dynamically by the API.
      "@next/next/no-img-element": "off",
    },
  },
]);
