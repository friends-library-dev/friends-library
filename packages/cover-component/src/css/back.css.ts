import { css } from './lib/helpers';

const backCss: string = css`
  .CoverBack .about-flp {
    opacity: 0.8;
    font-size: 0.123in;
    line-height: 160%;
    text-align: center;
  }

  .CoverBack .purpose,
  .CoverBack .website {
    box-sizing: border-box;
    left: 0;
    width: 100%;
    position: absolute;
  }

  .CoverBack .purpose {
    padding: 0 10%;
    bottom: 19%;
  }

  .CoverBack .website {
    bottom: 14%;
    margin-top: 0.175in;
  }

  .CoverBack .trim--s .purpose {
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

  .CoverBack .logo {
    color: white;
    height: 4.5%;
    position: absolute;
    bottom: 2.25%;
    left: 2.5%;
  }

  .CoverBack .logo--spanish {
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

  .CoverBack .isbn {
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
