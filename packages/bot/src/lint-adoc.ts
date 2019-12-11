import { lint } from '@friends-library/adoc-lint';
import { LintResult, Lang } from '@friends-library/types';
import { ModifiedAsciidocFile } from './type';

interface GithubCheckAnnotation {
  path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  annotation_level: 'notice' | 'warning' | 'failure';
  message: string;
  title?: string;
  raw_details?: string;
}

export function getLintAnnotations(
  files: ModifiedAsciidocFile[],
  lang: Lang,
): GithubCheckAnnotation[] {
  return files.reduce((annotations, { path, adoc }) => {
    const lintResults = lint(adoc, { lang });
    return [...annotations, ...lintResults.map(result => toAnnotation(result, path))];
  }, <GithubCheckAnnotation[]>[]);
}

function toAnnotation(result: LintResult, path: string): GithubCheckAnnotation {
  const annotation: GithubCheckAnnotation = {
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
    const details = `Recommended fix:\n\n${result.recommendation}`;
    annotation.raw_details = details;
  }

  return annotation;
}
