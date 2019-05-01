import guides from './guides.css';
import spine from './spine.css';
import initials from './initials.css';
import author from './author.css';
import diamond from './diamond.css';
import blurb from './blurb.css';

const css: string = /* css */ `

.web .cover,
.pdf body {
  font-family: 'Baskerville', Arial;
  background: white;
  color: white;
}

.web .cover-wrap {
  position: relative;
  margin: 0 auto;
}

.web .cover,
.web .cover-mask,
.web .cover-wrap {
  position: relative;
  width: var(--coverWidth);
  height: var(--coverHeight);
}

.web .cover-mask {
  position: absolute;
  margin: 0 auto;
  top: 0 !important;
  left: 0 !important;
  border: var(--trimBleed) solid rgba(255, 0, 0, 0.4);
  border-color: #eaeaea;
}

.front .logo-icon {
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

.front,
.back {
  position: absolute;
  top: var(--edgeToSafe);
  width: var(--safeAreaWidth);
  height: var(--safeAreaHeight);
}

.front {
  text-align: center;
  right: var(--edgeToSafe);
}

.back {
  left: var(--edgeToSafe);
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
`;

export default css;
