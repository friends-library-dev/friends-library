import css from './tmpl';

const authorCss: string = css`
  .trim--m .author {
    margin-top: 0.06in;
  }

  .trim--s .author {
    margin-top: 0.12in;
  }

  .author__line {
    width: 40%;
    height: 0.012in;
    background: white;
    margin: 0 auto 0 auto;
  }

  .author__name {
    font-weight: 400;
    font-size: 0.195in;
    opacity: 0.7;
  }
`;

export default authorCss;
