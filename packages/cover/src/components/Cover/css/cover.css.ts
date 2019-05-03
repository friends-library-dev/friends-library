import { isBrowser } from 'browser-or-node';
import guides from './guides.css';
import spine from './spine.css';
import initials from './initials.css';
import author from './author.css';
import diamond from './diamond.css';
import blurb from './blurb.css';
import threeD from './3d.css';

const css: string = /* css */ `

.web .cover,
.pdf body {
  font-family: 'Baskerville', Arial;
  background: white;
  color: white;
}

.web .cover-wrap {
  position: relative;
  margin: auto;
}

.web .cover,
.web .cover-mask,
.web .cover-wrap {
  position: relative;
  width: var(--coverWidth);
  height: var(--coverHeight);
}

.web .cover-mask {
  height: var(--pageHeight);
  width: var(--guideSafetyWidth);
  position: absolute;
  top: 0;
  left: 0 !important;
  border: var(--trimBleed) solid rgba(255, 0, 0, 0.4);
  border-color: #eaeaea;
  xborder-color: yellow;
  xbackground: rgba(255, 0, 0, 0.35);
  z-index: 1;
}

.front,
.back {
  position: absolute;
  top: var(--trimBleed);
  xbackground: red;
  width: var(--bookWidth);
  height: var(--bookHeight);
}

.front {
  right: var(--trimBleed);
}

.back {
  left: var(--trimBleed);
}

.front__safe,
.back__safe {
  position: absolute;
  top: var(--safety);
  left: var(--safety);
  width: var(--safeAreaWidth);
  height: var(--safeAreaHeight);
}

.front__safe {
  text-align: center;
}

.back__safe {

}

.front__safe .logo-icon {
  height: 6.5%;
  fill: var(--bgColor);
  position: absolute;
  top: 2.75%;
  right: 0.2in;
}

.bg-block {
  position: absolute;
  bottom: 0;
  left: 0;
  width: var(--coverWidth);
  height: 82%;
  background: var(--bgColor);
}

@page {
  size: var(--coverWidth) var(--coverHeight) landscape;
  margin: 0;
}

.title {
  margin-top: 64%;
  line-height: 200%;
  font-size: 0.35in;
  font-weight: 400;
  margin-left: 12%;
  margin-right: 12%;
  letter-spacing: 0.025in;
}

.isbn {
  width: 1.25in;
  background: white;
  padding: 0.075in;
  position: absolute;
  bottom: 0;
  right: 0;
}

${blurb}
${diamond}
${author}
${initials}
${spine}
${guides}
${isBrowser ? threeD : ''}
`;

export default css;
