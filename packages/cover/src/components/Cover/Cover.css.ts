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

#logo-icon {
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

.spine {
  width: var(--spineWidth);
  height: var(--coverHeight);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

.first-initial {
  top: 20%;
}

.last-initial {
  top: 47%;
}

.initial {
  position: absolute;
  color: white;
  opacity: 0.075;
  font-size: 2.5in;
  font-weight: 400;
  left: 50%;
  transform: translateX(-50%);
}

.author {
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 5%;
  width: var(--pageWidth);
}

.author-line {
  width: 40%;
  height: 0.01in;
  background: white;
  opacity: 0.6;
  margin: 0 auto 0 auto;
}

.author-name {
  font-weight: 400;
  font-size: 0.17in;
  opacity: 0.7;
}

.spine {
  /* spine styles */
}

.isbn {
  width: 1.25in;
  background: white;
  padding: 0.075in;
  position: absolute;
  bottom: 0;
  right: 0;
}

.diamond-wrap, .diamond {
  position: absolute;
  width: 0.26in;
  height: 0.26in;
  left: 50%;
}

.diamond-wrap {
  top: 2in;
  transform: translateX(-50%);
}

.diamond {
  background: white;
  transform: translateX(-50%) rotate(45deg);
}

.edition-initial {
  font-family: Georgia;
  font-size: 0.21in;
  position: absolute;
  color: var(--bgColor);
  width: 0.26in;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.blurb {
  margin: 26% 0 0 0;
  font-size: 0.16in;
  line-height: 135%;
  text-align: justify;
}

.trim--m .blurb {
  font-size: 0.26in;
}

.trim--xl .blurb {
  font-size: 0.19in;
}

/* --- GUIDES --- */
.guide {
  box-sizing: border-box;
  display: var(--guidesDisplay);
  border-style: dashed;
  border-color: red;
  position: absolute;
  border-width: 0;
}

.guide--vertical {
  border-right-width: 1px;
  height: 100%;
}

.guide--horizontal {
  width: 100%;
}

.guide--box {
  border-width:1px;
}

.guide--trim-bleed,
.web .cover-mask {
  height: var(--pageHeight);
  width: var(--guideSafetyWidth);
  left: var(--trimBleed);
  top: var(--trimBleed);
}

.guide--spine {
  border-color: blue;
}

.guide--spine-right {
  right: var(--edgeToSpine);
}

.guide--spine-left {
  left: var(--edgeToSpine);
}

.guide--safety {
  top: var(--edgeToSafe);
  border-color: orange;
  width: var(--safeAreaWidth);
  height: var(--safeAreaHeight);
}

.guide--safety-front {
  right: var(--edgeToSafe);
}

.guide--safety-back {
  left: var(--edgeToSafe);
}
`;

export default css;
