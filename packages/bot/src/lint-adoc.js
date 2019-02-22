// @flow
import { lint, type LintResult } from '@friends-library/asciidoc';
import type { ModifiedAsciidocFile } from './type';

type GithubCheckAnnotation = {
  path: string,
  start_line: number,
  end_line: number,
  start_column?: number,
  end_column?: number,
  annotation_level: 'notice' | 'warning' | 'failure',
  message: string,
  title?: string,
  raw_details?: string,
};

export function getLintAnnotations(
  files: Array<ModifiedAsciidocFile>,
): Array<GithubCheckAnnotation> {
  return files.reduce((annotations, { path, adoc }) => {
    const lintResults = lint(adoc);
    return [
      ...annotations,
      ...lintResults.map(result => toAnnotation(result, path)),
    ];
  }, []);
}

function toAnnotation(
  result: LintResult,
  path: string,
): GithubCheckAnnotation {
  const annotation: GithubCheckAnnotation = {
    path,
    start_line: result.line,
    end_line: result.line,
    start_column: result.column,
    end_column: result.column + 1,
    annotation_level: result.type === 'error' ? 'failure' : result.type,
    message: result.message,
  };

  if (result.recommendation) {
    const details = `Recommended fix:\n\n${result.recommendation}`;
    annotation.raw_details = details;
  }

  return annotation;
}
