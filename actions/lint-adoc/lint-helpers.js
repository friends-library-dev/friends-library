// @ts-check

/**
 * @param {Record<string, any>} lint
 * @param {string} path
 * @returns {Record<string, any>}
 */
function toAnnotation(lint, path) {
  const annotation = {
    path,
    start_line: lint.line,
    end_line: lint.line,
    annotation_level: lint.type === 'error' ? 'failure' : lint.type,
    message: lint.message,
  };

  if (lint.column !== false) {
    annotation.start_column = lint.column;
    annotation.end_column = lint.column + 1;
  }

  if (lint.recommendation) {
    const reco = lint.recommendation.startsWith('-->')
      ? lint.recommendation
      : `\`\`\`\n${lint.recommendation}\n\`\`\``;
    annotation.message += `\n\nRecommended fix:\n\n${reco}`;
  }

  return annotation;
}

/**
 * @param {string} path
 * @returns {{ lang: string; editionType: string }}
 */
function lintOptions(path) {
  const lang = process.env.GITHUB_REPOSITORY.startsWith('friends-library') ? 'en' : 'es';
  let edition = 'original';
  if (path.includes('modernized/')) edition = 'modernized';
  if (path.includes('updated/')) edition = 'updated';
  return { lang, editionType: edition };
}

module.exports = {
  toAnnotation,
  lintOptions,
};
