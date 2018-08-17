// @flow

export type Xml = string;

export type Html = string;

export type Asciidoc = string;

export type Css = string;

export type Url = string;

export type FileType = 'epub' | 'mobi' | 'pdf-web' | 'pdf-print';

export type Lang = 'en' | 'es';

export type Job = {|
  id: string,
  +spec: SourceSpec,
  +cmd: Command,
  +target: FileType,
  +filename: string,
|};

export type SourceSpec = {|
  +id: string,
  +lang: Lang,
  +filename: string,
  +epigraphs: Array<Epigraph>,
  +meta: DocumentMeta,
  +revision: DocumentRevision,
  +sections: Array<DocSection>,
  +notes: Notes,
|};

export type Command = {|
  +targets: Array<FileType>,
  +perform: boolean,
  +check: boolean,
  +open: boolean,
  +send: boolean,
  +email?: string,
|};

export type Epigraph = {|
  +text: string,
  +source: ?string,
|}

export type Notes = Map<string, Html>;

export type Heading = {|
  +id: string,
  +text: string,
  +shortText?: string,
  +sequence?: {|
    +type: 'chapter' | 'section',
    +number: number,
  |}
|};

export type DocSection = {|
  +id: string,
  +index: number,
  +heading: Heading,
  +html: Html,
|};

export type SourcePrecursor = {|
  +id: string,
  +lang: Lang,
  +adoc: Asciidoc,
  +config: Object,
  +revision: DocumentRevision,
  +meta: DocumentMeta,
  +filename: string,
|};

export type DocumentRevision = {|
  +timestamp: number,
  +sha: string,
  +url: Url,
|};

export type DocumentMeta = {|
  +title: string,
  +originalTitle?: string,
  +published?: number,
  +author: {|
    +name: string,
    +nameSort: string,
  |}
|};

export type FileManifest = {
  [string]: string,
};
