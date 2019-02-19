// @flow
import type { Html } from '../../../../../type';
import type { Job } from '../../type';
import { navText } from '../headings';

export function nav(job: Job): Html {
  if (job.spec.sections.length === 1) {
    return '<nav epub:type="toc" id="toc"><ol></ol></nav>';
  }

  return `
    <nav epub:type="toc" id="toc">
      <h2>Table of Contents</h2>
      <ol>
        ${tocItems(job).map(item => {
    const hidden = item.hidden ? ' hidden=""' : '';
    return `<li${hidden}><a href="${item.href}">${item.text}</a></li>`;
  }).join('\n        ')}
      </ol>
    </nav>
    <nav epub:type="landmarks" hidden="">
      <ol>
        ${landmarks(job).map(item => (
    `<li><a href="${item.href}" epub:type="${item.type}">${item.text}</a></li>`
  )).join('\n        ')}
      </ol>
    </nav>
  `.trim();
}


export function tocItems({ spec: { sections } }: Job): Array<Object> {
  const items = [];

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


export function landmarks({ target, meta: { frontmatter } }: Job): Array<Object> {
  const landmarkItems = [];

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
