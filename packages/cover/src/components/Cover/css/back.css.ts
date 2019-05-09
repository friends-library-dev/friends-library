import css from './tmpl';

const backCss: string = css`
  .back .diamond {
    top: 19%;
  }

  .back .logo-icon {
    right: auto;
    left: 0.2in;
  }

  .brackets {
    fill: white;
    position: absolute;
    opacity: 0.32;
    top: 28%;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
  }

  .purpose {
    position: absolute;
    left: 0;
    bottom: 19%;
    margin: 0 7%;
    font-size: 0.115in;
    line-height: 160%;
    text-align: center;
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
