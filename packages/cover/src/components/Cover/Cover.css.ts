const css: string = /* css */ `

.web .cover,
.pdf body {
  font-family: Georgia;
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
  margin-top: 2in;
  line-height: 175%;
  font-size: 0.4in;
  font-weight: 400;
}

.author {
  font-weight: 400;
  font-style: italic;
}
`;

export default css;
