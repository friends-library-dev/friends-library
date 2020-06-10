// @ts-check
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * @param {boolean} gitAdd
 * @returns void
 */
function handleBundledActionJs(gitAdd) {
  const BUNDLED_JS = '!**/bundled/index.js\n';
  const ACTION_IGNORE = fs.readFileSync('./actions/.gitignore', 'utf8');

  const currentBranch = execSync('git rev-parse --symbolic-full-name --abbrev-ref HEAD')
    .toString()
    .trim();

  const actionDirs = fs
    .readdirSync(`./actions`, { withFileTypes: true })
    .filter(dirent => dirent.name !== 'workflows')
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (!currentBranch.startsWith('actions')) {
    // make sure we don't commit ncc-bundled js
    const FLAGS = '--force --ignore-unmatch --quiet';
    actionDirs.forEach(action =>
      execSync(`git rm ${FLAGS} ./actions/${action}/bundled/index.js`),
    );

    // make sure we don't get the actions* branch special .gitignore rule
    if (ACTION_IGNORE.includes(BUNDLED_JS)) {
      fs.writeFileSync('./actions/.gitignore', ACTION_IGNORE.replace(BUNDLED_JS, ''));
      gitAdd && execSync('git add ./actions/.gitignore');
    }
  } else {
    if (!ACTION_IGNORE.includes(BUNDLED_JS)) {
      fs.writeFileSync('./actions/.gitignore', `${ACTION_IGNORE}${BUNDLED_JS}`);
      execSync('git add ./actions/.gitignore');
      if (!gitAdd) {
        actionDirs.forEach(action => {
          const path = `./actions/${action}/bundled/index.js`;
          fs.existsSync(path) && execSync(`git add ${path}`);
        });
      }
    }
  }
}

module.exports = {
  handleBundledActionJs,
};
