// @ts-check
const fs = require('fs');

/**
 * @returns {string[]}
 */
function newOrModifiedFiles() {
  return (
    ['files_modified.json', 'files_added.json']
      .map(basename => `${process.env.HOME}/${basename}`)
      .map(path => fs.readFileSync(path).toString())
      // @ts-ignore
      .flatMap(contents => JSON.parse(contents))
      .filter(file => file.endsWith('.adoc'))
  );
}

module.exports = {
  newOrModifiedFiles,
};
