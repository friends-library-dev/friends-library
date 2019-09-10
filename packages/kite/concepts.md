# Concepts

## Overview

```
(filesystem asciidoc dir) -----+                                           +---> Job
                               |                                           |
(github asciidoc PR) ----------+----> SourcePrecursor ----> SourceSpec ----+---> Job
                               |       (asciidoc)             (html)       |
(jones in-memory asciidoc) ----+                                           +---> Job
```

## `SourcePrecursor`

> In-memory representation of a source document, with only asciidoc.

When creating a book, the first thing that is required is that a `SourcePrecursor` be
created, it's type is:

```TS
type SourcePrecursor = {
  id: string;
  lang: Lang;
  adoc: Asciidoc;
  config: { [key: string]: any };
  customCss: CustomCss;
  revision: DocumentRevision;
  meta: DocumentMeta;
  filename: string;
>;
```

The core concept to understand about a `SourcePrecursor` is that it represents an
in-memory representation of everything required to make a book. You can create one from
various sources, the most common being an `asciidoc` directory on a local filesystem, but
the github bot also makes one from Pull Request files pulled from the Github API, and
Jones builds one from in-memory `asciidoc` being edited.

Creating a `SourcePrecursor` is hard to test, but once you've got one, you can test it
pretty easily, especially it's transformation into a `SourceSpec`.

One of the key things about a `SourcePrecursor` is that _it has the full, combined
asciidoc_, but not any derived HTML.

The main key fact about a `SourceSpec` is that it has no `asciidoc`, but rather it
contains the already-converted and processed HTML and footnotes, derived from the
`asciidoc`.

## `SourceSpec`

> In-memory representation of a source doc, with HTML sections, footnotes, and epigraphs,
> but no asciidoc.

The `SourceSpec` is similar to the `SourcePrecursor`, except it no longer contains
`asciidoc`, but rather it contains _processed derivitives_ of the `asciidoc`, including:

- HTML (divided into chapters/sections)
- footnotes
- epigraphs

It's type is as follows:

```TS
type SourceSpec = {
  id: string;
  lang: Lang;
  size: number;
  filename: string;
  epigraphs: Epigraph[];
  config: { [key: string]: any };
  customCss: CustomCss;
  meta: DocumentMeta;
  revision: DocumentRevision;
  sections: DocSection[];
  notes: Notes;
  conversionLogs: AsciidocConversionLog[];
};
```

A `SourceSpec` represents a book further along in the pipeline. It is still agnostic about
what target or type of artifact it will be turned into, but the raw `asciidoc` is gone,
replaced with processed entities ready to be assembled as needed into other formats.

It's easy to test the transformation of a `SourcePrecursor` into a `SourceSpec`, as it's a
deterministic transformation of one in-memory object to another.

There's still a one-to-one relationship between a "source" document and the `SourceSpec`
-- it is a refined, processed representation of a the data about the book itself, not
considering output targets or formats. You would never need to derive two `SourceSpec`s
for the same book.

## `Job`

> Wrapper around a `SourceSpec` with a specific output target and related metadata

A `Job` represents an intention to make something specific from a source document. It's
type is as follows:

```TS
interface Job {
  id: string;
  spec: SourceSpec;
  meta: JobMeta;
  target: FileType;
  filename: string;
}
```

You can see from the type that it is basically just a thin wrapper around a `SourceSpec`.
The key addition here is the `target` prop: that holds the important fact of what kind of
artifact or thing we're going to derive.

The `meta` prop passes along a pile of info that will be necessary as further code
receives the `Job`, doing it's part to created the desired end result -- some of these
functions will need additional information about the user intent, which will be stored on
the `meta` prop.

The `Job` object is no longer necessarily _one-to-one_ with the source document itself. It
is very possible that we will take a single book and be aiming to derive several targets,
so a book could turn into several `Jobs`, but all of the jobs would be carrying the same
`SourceSpec`.
