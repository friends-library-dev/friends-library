import css from './tmpl';

const frontCss: string = css`
  .front__safe {
    text-align: center;
  }

  .front__main {
    position: relative;
    width: 100%;
    height: 4.7in;
  }

  .trim--s .front__main {
    margin-top: 1.15in;
  }

  .trim--m .front__main {
    margin-top: 1.96in;
    height: 4.825in;
  }

  .trim--xl .front__main {
    margin-top: 2.35in;
  }

  .front .title-wrap,
  .front .initials {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
  }

  .front .title-wrap {
    justify-content: center;
  }

  .front .title {
    line-height: 200%;
    font-size: 0.35in;
    font-weight: 400;
    margin-left: 12%;
    margin-right: 12%;
    letter-spacing: 0.025in;
  }
`;

export default frontCss;
