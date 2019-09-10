import css from './tmpl';

const spineCss: string = css`
  .spine {
    width: var(--spineWidth);
    height: var(--bookHeight);
    position: absolute;
    top: var(--trimBleed);
    left: var(--edgeToSpine);
  }

  .pdf .binding--saddle-stitch .spine,
  .pdf .binding--saddle-stitch .guide--spine,
  .web .cover--2d .binding--saddle-stitch .spine,
  .web .cover--2d .binding--saddle-stitch .guide--spine {
    width: 0;
    display: none;
  }

  .spine--pgs-lt-140 > * {
    display: none !important;
  }

  .spine .logo-icon {
    height: 4%;
    fill: var(--bgColor);
    position: absolute;
    top: var(--edgeToSafe);
    top: 7%;
    left: 50%;
    transform: translateX(-44%);
  }

  .spine .diamond {
    fill: var(--bgColor);
    width: 0.365in;
    top: auto;
    bottom: 3.5% !important;
    fill: white;
  }

  .spine__title,
  .spine__author {
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    position: absolute;
    writing-mode: vertical-rl;
    line-height: var(--spineWidth);
    font-size: 0.26in;
    word-spacing: 0.035in;
    top: 20%;
  }

  .trim--s .spine__title {
    top: 15%;
  }

  .trim--s .spine .logo-icon {
    top: 5.6%;
  }

  .trim--xl .spine__title {
    top: 21.5%;
  }

  .spine__author {
    display: var(--spineAuthorDisplay);
    top: auto;
    bottom: 11%;
    font-size: 0.2in;
  }

  .spine--pgs-lte-180 .spine__title {
    font-size: 0.23in;
  }

  .spine--pgs-lte-180 .diamond {
    width: 0.3in;
  }

  .spine--pgs-lte-180 .logo-icon {
    height: 3.4%;
  }

  .spine--pgs-lte-160 .diamond {
    width: 0.25in;
  }

  .spine--pgs-lte-160 .logo-icon {
    height: 3.23%;
  }
`;

export default spineCss;
