import css from './tmpl';

const captureCss: string = css`
  .capturing-screenshot form,
  .capturing-screenshot .Toolbar {
    display: none !important;
  }

  .capturing-screenshot .cover-wrap {
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(2.4457); /* 1600px x 2400px */
    transform-origin: top left;
  }
`;

export default captureCss;
