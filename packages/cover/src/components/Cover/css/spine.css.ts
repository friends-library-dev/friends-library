import { css } from '../css';

const spineCss: string = css`
  .spine {
    width: var(--spineWidth);
    height: var(--bookHeight);
    position: absolute;
    top: var(--trimBleed);
    left: var(--edgeToSpine);
  }

  .spine .logo-icon {
    display: var(--spineDisplay);
    height: 3.5%;
    fill: white;
    position: absolute;
    bottom: var(--edgeToSafe);
    left: 50%;
    transform: translateX(-44%);
  }

  .spine__title {
    display: var(--spineDisplay);
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    position: absolute;
    writing-mode: vertical-rl;
    line-height: var(--spineWidth);
    font-size: 0.26in;
    top: 20%;
  }
`;

export default spineCss;
