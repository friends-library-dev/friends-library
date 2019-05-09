import { isBrowser } from 'browser-or-node';
import guides from './guides.css';
import spine from './spine.css';
import initials from './initials.css';
import author from './author.css';
import blurb from './blurb.css';
import threeD from './3d.css';
import back from './back.css';
import front from './front.css';
import css from './tmpl';

const coverCss: string = css`

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
  z-index: 1;
}

.front,
.back {
  position: absolute;
  top: var(--trimBleed);
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

.diamond {
  fill: white;
  left: 50%;
  top: 23%;
  transform: translateX(-50%);
  position: absolute;
  width: 12%;
}

.back__safe .logo-icon,
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



${blurb}
${author}
${initials}
${spine}
${guides}
${isBrowser ? threeD : ''}
${front}
${back};
`;

export default coverCss;
