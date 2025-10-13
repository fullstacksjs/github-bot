/**
 * @see https://github.com/lint-staged/lint-staged
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*": "cspell",
  "*.{js,mjs,ts}": "eslint --fix",
  "*.{md,json}": "prettier --write",
};
