import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable unused-vars rule
      "@typescript-eslint/no-explicit-any": "off", // Disable no-explicit-any rule
      "prefer-const": "off", // Disable prefer-const rule
      "no-var": "off", // Disable no-var rule
    },
  },
];

export default eslintConfig;
