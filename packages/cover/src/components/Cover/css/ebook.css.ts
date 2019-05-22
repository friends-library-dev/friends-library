import css from './tmpl';

const ebookCss: string = css`
  /* .ebook .back,
  .ebook .spine, */
  .ebook.web .cover-mask {
    display: none;
  }

  .ebook.web .cover-wrap {
    width: var(--pageWidth);
    overflow: hidden;
    position: absolute;
    top: -1.49in;
    left: 0;
    transform: scale(1.5);
    transform-origin: top left;
  }

  .ebook.web .cover {
    position: absolute;
    top: 0;
    right: 0;
  }

  .ebook.web .front {
    transform: translateX(var(--trimBleed)) scale(1.1) translateY(var(--safety));
  }

  .ebook.web .back .logo {
    position: fixed;
    top: 1.2in;
    left: 0.2in;
    /* transform: translateX(4.5in) translateY(-5.17in); */
  }

  .ebook.web .front {
    /* transform: scale(1.2); */
  }

  .ebook.web .cover,
  .ebook.web .cover-wrap,
  .ebook.web .bg-block {
  }
`;

export default ebookCss;
