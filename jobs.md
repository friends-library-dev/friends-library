## Jobs to be done by monorepo app

- create and open PDFs while doing intake
- create consumable artifacts for public via website `kite update`
- upload consumable artifacts into cloud storage for public `kite update`
- create and open real consumable artifacts for development & testing `kite publish`
- create and open reference test documents for formatting edge cases `kite publish:ref`
- build and deploy websites in spanish and english
- lint chunks of asciidoc for errors
- lint filesystem dirs of asciidoc for errors
- create a single pdf cover via cli on demand `kite cover` -- but not actually ever used
  from CLI by human 🤔
- serve, build and deploy cover web app
- serve, build and deploy editor app, including linting of in memory asciidoc, and html
  previews of chapters
- convert docbook files to asciidoc
- chapterize converted docbook files

## New package structure

- `/adoc-lint` -- asciidoc linting (nothing node/fs specific)
- `/adoc-utils` -- misc asciidoc utils

## new `fl` command

- `test` -- `yarn fl make en/george-fox` -- mostly similar to current `yarn kite`
- `

## Thorny Problems

- TITIP - a compilation composed of multiple small document from various authors
- IP complete works - a true multi-volume
- Piety Promoted - a true compilation, and multi-volume
- Shillitoe - a single volume too long to be printed in one paperback
- cover component - should be _repeatedly_ embeddable in website, in addition to producing
  PDFs and cover website
