import { defineConfig } from "@fullstacksjs/eslint-config";

export default defineConfig({
  esm: true,
  node: true,
  strict: true,
  rules: {
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
  },
});
