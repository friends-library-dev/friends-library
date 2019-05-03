const css: string = /* css */ `

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

.guide--trim-bleed{
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

.guide--spine-center {
  border-color: magenta;
  opacity: 0.75;
  left: var(--halfSpineWidth);
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

.cover--show-guides .front__safe,
.cover--show-guides .back__safe {
  outline: 1px dashed orange;
  outline-offset: -1px;
}
`;

export default css;
