import css from './tmpl';

const spineCss: string = css`
  .spine {
    width: var(--spineWidth);
    height: var(--bookHeight);
    position: absolute;
    top: var(--trimBleed);
    left: var(--edgeToSpine);
  }

  .spine > * {
    display: var(--spineDisplay);
  }

  .spine .logo-icon {
    height: 3.3%;
    fill: var(--bgColor);
    position: absolute;
    top: var(--edgeToSafe);
    left: 50%;
    transform: translateX(-44%);
  }

  .spine .diamond {
    fill: var(--bgColor);
    width: 0.365in;
    top: 10%;
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

  .spine__author {
    top: auto;
    bottom: 5%;
  }
`;

export default spineCss;
