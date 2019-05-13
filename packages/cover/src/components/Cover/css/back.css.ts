import css from './tmpl';

const backCss: string = css`
  .back .diamond {
    top: 19%;
  }

  .brackets {
    fill: white;
    position: absolute;
    opacity: 0.32;
    top: 28%;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    /* individual brackets maybe a hair narrower? --jason */
  }

  .about-flp {
    position: absolute;
    left: 0;
    opacity: 0.8;
    bottom: 14.5%;
    margin: 0 10%;
    font-size: 0.123in;
    line-height: 160%;
    text-align: center;
  }

  .website {
    margin-top: 0.175in;
  }

  .logo {
    color: white;
    height: 4.5%;
    position: absolute;
    bottom: 2.25%;
    left: 2.5%;
  }

  .isbn {
    width: 1.25in;
    background: white;
    padding: 0.075in;
    position: absolute;
    bottom: 2.25%;
    right: 0;
  }
`;

export default backCss;
