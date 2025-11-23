export default {
  "commit-msg": "./node_modules/.bin/commitlint --edit $1",
  "pre-commit": "./node_modules/.bin/lint-staged",
  "pre-push": " ./node_modules/.bin/tsc && npm run test",
};
