import { LintOptions, EditionType } from '@friends-library/types';

export interface Annotation {
  path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  message: string;
  annotation_level: 'failure';
}

export function toAnnotation(lint: Record<string, any>, path: string): Annotation {
  const annotation: Annotation = {
    path,
    start_line: lint.line,
    end_line: lint.line,
    annotation_level: `failure`,
    message: lint.message,
  };

  if (lint.column !== false) {
    annotation.start_column = lint.column;
    annotation.end_column = lint.column + 1;
  }

  if (lint.recommendation) {
    const reco = lint.recommendation.startsWith(`-->`)
      ? `${lint.recommendation.replace(/^--> ?/, ``)}`
      : `\`\`\`\n${lint.recommendation}\n\`\`\``;
    annotation.message += `\n\nRecommended fix:\n\n${reco}`;
  }

  return annotation;
}

export function lintOptions(path: string): LintOptions {
  const lang = process.env.GITHUB_REPOSITORY?.startsWith(`friends-library`) ? `en` : `es`;
  let edition: EditionType = `original`;
  if (path.includes(`modernized/`)) edition = `modernized`;
  if (path.includes(`updated/`)) edition = `updated`;
  return { lang, editionType: edition };
}
