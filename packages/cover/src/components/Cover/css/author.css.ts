import { css } from '../css';

const authorCss: string = css`
  .author {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 5%;
    width: var(--pageWidth);
  }

  .author__line {
    width: 40%;
    height: 0.01in;
    background: white;
    opacity: 0.6;
    margin: 0 auto 0 auto;
  }

  .author__name {
    font-weight: 400;
    font-size: 0.17in;
    opacity: 0.7;
  }
`;

export default authorCss;
