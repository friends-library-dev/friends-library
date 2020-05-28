// @ts-check
const fs = require('fs');
const client = require('../github-client');
const { newOrModifiedFiles } = require('../helpers');
const { toAnnotation, lintOptions } = require('./lint-helpers');

const { GITHUB_SHA, GITHUB_REPOSITORY, GITHUB_WORKSPACE } = process.env;

const COMPILED_MODULE = `${GITHUB_WORKSPACE}/fl/packages/adoc-lint/dist/index.js`;
const { lint } = require(COMPILED_MODULE);

async function main() {
  let allLints = [];
  let annotations = [];

  newOrModifiedFiles().forEach(path => {
    const asciidoc = fs.readFileSync(path).toString();
    const lints = lint(asciidoc, lintOptions(path));
    allLints = allLints.concat(lints);
    annotations = annotations.concat(lints.map(l => toAnnotation(l, path)));
  });

  const json = {
    name: 'lint-adoc',
    head_sha: GITHUB_SHA,
    status: 'completed',
    conclusion: 'success',
  };

  if (annotations.length) {
    json.conclusion = 'failure';
    json.output = {
      title: 'Asciidoc lint failure',
      summary: `Found ${annotations.length} problems`,
      annotations,
    };
  }

  try {
    const apiJson = await client.postJson(`/repos/${GITHUB_REPOSITORY}/check-runs`, json);
    console.log(apiJson);
  } catch (err) {
    console.error('Error creating check run', err);
  }

  console.log('------------');

  if (annotations.length) {
    console.error(`${allLints.length} lint errors!`);
    console.error(allLints);
  } else {
    console.log('No lint violations found.');
  }
}

main();
