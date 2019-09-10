import css from './tmpl';

const ebookCss: string = css`
  .cover--ebook .spine,
  .cover--ebook .back,
  .cover--ebook .cover-mask,
  .cover--ebook .guide--trim-bleed,
  .cover--ebook .guide--spine {
    display: none;
  }

  .cover--ebook .bg-block {
    width: var(--bookWidth);
    height: var(--bgHeightSizeXl);
  }

  .cover--ebook.cover-wrap,
  .cover--ebook .cover {
    width: var(--bookWidth);
    height: var(--bookHeight);
  }

  .cover--ebook .front {
    top: 0;
    right: 0;
  }
`;

export default ebookCss;
