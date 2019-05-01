const css: string = /* css */ `
.spine {
  display: var(--spineDisplay);
  width: var(--spineWidth);
  height: var(--coverHeight);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.spine .logo-icon {
  height: 3.5%;
  fill: white;
  position: absolute;
  bottom: var(--edgeToSafe);
  left: 50%;
  transform: translateX(-44%);
}

.spine__title {
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  position: absolute;
  writing-mode: vertical-rl;
  line-height: var(--spineWidth);
  font-size: 0.26in;
  top: 20%;
}
`;

export default css;
