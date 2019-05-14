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
    height: 4in;
    margin-top: 1.32in;
  }

  .trim--m .front__main {
    margin-top: 1.96in;
    height: 4.825in;
  }

  .flp {
    color: #bbb;
    position: absolute;
    left: 0.2in;
    font-size: 0.19in;
  }

  .trim--s .flp {
    top: 0.15in;
    font-size: 0.16in;
    left: 0.1in;
  }

  .trim--m .flp {
    top: 0.41in;
  }

  .trim--xl .flp {
    top: 0.53in;
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
