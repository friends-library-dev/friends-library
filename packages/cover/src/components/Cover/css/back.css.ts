import css from './tmpl';

const backCss: string = css`
  .back .diamond {
    top: 19%;
  }

  .trim--s .back .diamond {
    top: 13%;
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

  .trim--s .brackets {
    top: 23%;
    width: 90%;
    transform: translateX(-50%) scaleY(1.3);
  }

  .about-flp {
    opacity: 0.8;
    font-size: 0.123in;
    line-height: 160%;
    text-align: center;
  }

  .purpose,
  .website {
    box-sizing: border-box;
    left: 0;
    width: 100%;
    position: absolute;
  }

  .purpose {
    padding: 0 10%;
    bottom: 19%;
  }

  .website {
    bottom: 14%;
    margin-top: 0.175in;
  }

  .trim--s .purpose {
    bottom: 18.25%;
    padding: 0 7%;
    line-height: 145%;
    font-size: 0.12in;
  }

  .trim--s .website {
    line-height: 142%;
    bottom: 0.425in;
    left: 0.03in;
    width: 65%;
    text-align: left;
    position: absolute;
  }

  .logo {
    color: white;
    height: 4.5%;
    position: absolute;
    bottom: 2.25%;
    left: 2.5%;
  }

  .logo--spanish {
    height: 5.2%;
    bottom: 1.4%;
  }

  .trim--s .logo {
    bottom: 0.75%;
    left: 1%;
  }

  .trim--s .logo--spanish {
    bottom: -0.1%;
  }

  .isbn {
    width: 1.25in;
    background: white;
    padding: 0.075in;
    position: absolute;
    bottom: 2.25%;
    right: 0;
  }

  .trim--s .isbn {
    bottom: 0.75%;
    transform: scaleX(0.9);
  }
`;

export default backCss;
