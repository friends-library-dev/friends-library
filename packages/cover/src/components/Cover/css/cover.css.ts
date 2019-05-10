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
  top: 0;
  transform: translateX(-50%);
  position: absolute;
  width: 12%;
}

.back__safe .logo-icon,
.front__safe .logo-icon {
  height: 0.45in;
  fill: var(--bgColor);
  position: absolute;
}

.trim--s .back__safe .logo-icon,
.trim--s .front__safe .logo-icon {
  top: 0;
  right: -0.068in;
}

.trim--m .back__safe .logo-icon,
.trim--m .front__safe .logo-icon {
  top: 3.4%;
  right: 0.2in;
}

.trim--xl .back__safe .logo-icon,
.trim--xl .front__safe .logo-icon {
  top: 4.5%;
  right: 0.1in
}

.bg-block {
  position: absolute;
  bottom: 0;
  left: 0;
  width: var(--coverWidth);
  background: var(--bgColor);
}

.trim--s .bg-block {
  height: var(--bgHeightPlusTrimBleedSizeS);
}

.trim--m .bg-block {
  height: var(--bgHeightPlusTrimBleedSizeM);
}

.trim--xl .bg-block {
  height: var(--bgHeightPlusTrimBleedSizeXl);
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
