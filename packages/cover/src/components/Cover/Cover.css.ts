const css: string = /* css */ `

.web .cover,
.pdf body {
  font-family: 'Baskerville', Arial;
  background: white;
  color: white;
}

.web .cover {
  position: relative;
  width: var(--coverWidth);
  height: var(--coverHeight);
}

.logo {
  width: 0.35in;
  position: absolute;
  top: 0.35in;
  right: 0.25in;
}

.bg-block {
  position: absolute;
  bottom: 0;
  left: 0;
  width: var(--coverWidth);
  height: 82%;
  background: #6c3142;
}

.front,
.back {
  position: absolute;
  top: var(--trim);
  width: var(--pageWidth);
  height: var(--pageHeight);
}

.front {
  text-align: center;
  right: var(--trim);
}

.back {
  left: var(--trim);
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
`;

export default css;
