const fs = require('fs');
const client = require('../github-client');

const { HOME, GITHUB_SHA, GITHUB_REPOSITORY, GITHUB_WORKSPACE } = process.env;

const COMPILED_LINT_MODULE_PATH = `${GITHUB_WORKSPACE}/fl/packages/adoc-lint/dist/index.js`;
const { lint } = require(COMPILED_LINT_MODULE_PATH);

const modified = JSON.parse(fileContents(`${HOME}/files_modified.json`));
const added = JSON.parse(fileContents(`${HOME}/files_added.json`));
const filesToLint = modified.concat(added).filter((f) => f.endsWith('.adoc'));

let annotations = [];
filesToLint.forEach((path) => {
  const lints = lint(fileContents(path));
  annotations = annotations.concat(lints.map((l) => toAnnotation(l, path)));
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

client.postJson(`/repos/${GITHUB_REPOSITORY}/check-runs`, json);

function toAnnotation(result, path) {
  const annotation = {
    path,
    start_line: result.line,
    end_line: result.line,
    annotation_level: result.type === 'error' ? 'failure' : result.type,
    message: result.message,
  };

  if (result.column !== false) {
    annotation.start_column = result.column;
    annotation.end_column = result.column + 1;
  }

  if (result.recommendation) {
    const reco = result.recommendation.startsWith('-->')
      ? result.recommendation
      : `\`\`\`\n${result.recommendation}\n\`\`\``;
    annotation.message += `\n\nRecommended fix:\n\n${reco}`;
  }

  return annotation;
}

function fileContents(path) {
  return fs.readFileSync(path).toString();
}
