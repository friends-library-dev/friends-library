import { navText } from '@friends-library/doc-html';
import { Html, DocPrecursor, EbookConfig, Lang } from '@friends-library/types';

export function nav(dpc: DocPrecursor, conf: EbookConfig): Html {
  if (dpc.sections.length === 1) {
    return `<nav epub:type="toc" id="toc"><ol></ol></nav>`;
  }

  return `
    <nav epub:type="toc" id="toc">
      <h2>${dpc.lang === `en` ? `Table of Contents` : `Índice`}</h2>
      <ol>
        ${tocItems(dpc)
          .map((item) => {
            const hidden = item.hidden ? ` hidden=""` : ``;
            return `<li${hidden}><a href="${item.href}">${item.text}</a></li>`;
          })
          .join(`\n        `)}
      </ol>
    </nav>
    <nav epub:type="landmarks" hidden="">
      <ol>
        ${landmarks(conf, dpc.lang)
          .map(
            (item) =>
              `<li><a href="${item.href}" epub:type="${item.type}">${item.text}</a></li>`,
          )
          .join(`\n        `)}
      </ol>
    </nav>
  `.trim();
}

interface TocItem {
  href: string;
  text: string;
  hidden?: true;
}

export function tocItems({ sections, lang }: DocPrecursor): TocItem[] {
  const items: TocItem[] = [];

  items.push({
    hidden: true,
    href: `half-title.xhtml`,
    text: lang === `en` ? `Title page` : `Portada`,
  });

  sections.forEach((section) => {
    const text = navText(section.heading);
    items.push({
      href: `${section.id}.xhtml`,
      text: section.isIntermediateTitle ? `~ ${text} ~` : text,
    });
  });

  return items;
}

interface Landmark {
  type: 'toc' | 'titlepage' | 'bodymatter';
  href: 'nav.xhtml' | 'half-title.xhtml' | 'section1.xhtml';
  text: string;
}

export function landmarks({ subType, frontmatter }: EbookConfig, lang: Lang): Landmark[] {
  const landmarkItems: Landmark[] = [];

  landmarkItems.push({
    type: `titlepage`,
    href: `half-title.xhtml`,
    text: lang === `en` ? `Title page` : `Portada`,
  });

  if (subType === `mobi`) {
    landmarkItems.push({
      type: `toc`,
      href: `nav.xhtml`,
      text: lang === `en` ? `Table of Contents` : `Índice`,
    });
  }

  landmarkItems.push({
    type: `bodymatter`,
    href: frontmatter ? `half-title.xhtml` : `section1.xhtml`,
    text: lang === `en` ? `Beginning` : `Comenzando`,
  });

  return landmarkItems;
}
