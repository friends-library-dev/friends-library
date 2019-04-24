import { navText } from '@friends-library/asciidoc';
import { Html, Job } from '@friends-library/types';

export function nav(job: Job): Html {
  if (job.spec.sections.length === 1) {
    return '<nav epub:type="toc" id="toc"><ol></ol></nav>';
  }

  return `
    <nav epub:type="toc" id="toc">
      <h2>Table of Contents</h2>
      <ol>
        ${tocItems(job)
          .map(item => {
            const hidden = item.hidden ? ' hidden=""' : '';
            return `<li${hidden}><a href="${item.href}">${item.text}</a></li>`;
          })
          .join('\n        ')}
      </ol>
    </nav>
    <nav epub:type="landmarks" hidden="">
      <ol>
        ${landmarks(job)
          .map(
            item =>
              `<li><a href="${item.href}" epub:type="${item.type}">${item.text}</a></li>`,
          )
          .join('\n        ')}
      </ol>
    </nav>
  `.trim();
}

interface TocItem {
  href: string;
  text: string;
  hidden?: true;
}

export function tocItems({ spec: { sections } }: Job): TocItem[] {
  const items: TocItem[] = [];

  items.push({
    hidden: true,
    href: 'half-title.xhtml',
    text: 'Title page',
  });

  sections.forEach(section => {
    items.push({
      href: `${section.id}.xhtml`,
      text: navText(section.heading),
    });
  });

  return items;
}

interface Landmark {
  type: 'toc' | 'titlepage' | 'bodymatter';
  href: 'nav.xhtml' | 'half-title.xhtml' | 'section1.xhtml';
  text: string;
}

export function landmarks({ target, meta: { frontmatter } }: Job): Landmark[] {
  const landmarkItems: Landmark[] = [];

  landmarkItems.push({
    type: 'titlepage',
    href: 'half-title.xhtml',
    text: 'Title page',
  });

  if (target === 'mobi') {
    landmarkItems.push({
      type: 'toc',
      href: 'nav.xhtml',
      text: 'Table of Contents',
    });
  }

  landmarkItems.push({
    type: 'bodymatter',
    href: frontmatter ? 'half-title.xhtml' : 'section1.xhtml',
    text: 'Beginning',
  });

  return landmarkItems;
}
