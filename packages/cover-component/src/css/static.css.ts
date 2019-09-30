import { Css } from '@friends-library/types';
import { css } from './lib/helpers';
import spineCss from './spine.css';
import colorsCss from './colors.css';

const cssStr: Css = css`
  .CoverFront,
  .CoverBack,
  .CoverSpine {
    font-family: 'Baskerville', Georgia, serif;
    background: white;
    color: white;
  }

  .CoverFront {
    position: relative;
  }

  .bg-block {
    position: absolute;
    width: 100%;
    height: 81.166666666%;
    bottom: 0;
  }

  .CoverFront .logo-icon {
    width: 8%;
    position: absolute;
    top: 5%;
    right: 5%;
  }

  .CoverFront .front__safe {
    position: relative;
    z-index: 2;
    height: 100%;
  }

  .CoverFront .flp {
    color: #aaa;
    position: absolute;
    top: 7%;
    left: 5%;
    font-size: 90%;
    font-size: 95%;
  }

  .CoverFront .front__main {
    width: 100%;
    height: 60%;
  }

  .CoverFront .title-wrap,
  .CoverFront .initials {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
  }

  .CoverFront .front__main,
  .CoverFront .author {
    position: relative;
    top: 23%;
  }

  .CoverFront .author {
    text-align: center;
    font-size: 200%;
  }

  .CoverFront .author__line {
    width: 40%;
    background: white;
    height: 2px;
    margin: 0 auto 0 auto;
  }

  .CoverFront .title-wrap {
    /* background: rgba(0, 255, 0, 0.3); */
    justify-content: center;
    text-align: center;
    font-size: 300%;
    padding: 0 12%;
  }

  .CoverFront .initials > div {
    width: 100%;
    height: 50%;
    position: relative;
  }

  .CoverFront .initial {
    width: 100%;
    text-align: center;
    position: absolute;
    margin: 0;
    padding: 0;
    color: white;
    opacity: 0.25;
    font-size: 1450%;
    /* font-size: 2.6544506602702698in; */
    /* line-height: 2.6544506602702698in; */
    font-weight: 400;
    left: 0;
  }

  ${spineCss}
  ${colorsCss}
`;

export default cssStr;
