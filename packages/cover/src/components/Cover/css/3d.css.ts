import { css } from '../css';

const threeDCss: string = css`
  .cover-wrap.cover--3d,
  .cover--3d .cover {
    width: var(--bookWidth);
    height: var(--bookHeight);
  }

  .web .cover--3d .cover {
    transition: transform 1s;
    margin: 0;
    position: relative;
    background: transparent;
    transform-style: preserve-3d;
    transform: translateZ(-var(--halfSpineWidth));
  }

  .cover--3d .top,
  .cover--3d .bottom,
  .cover--3d .right,
  .cover--3d .front,
  .cover--3d .back,
  .cover--3d .spine {
    top: 0;
    left: 0;
    position: absolute;
  }

  .cover--3d .spine,
  .cover--3d .right {
    left: var(--threeDLeftOffset);
  }

  .cover--3d .top,
  .cover--3d .bottom {
    top: var(--threeDTopOffset);
  }

  /* 3d-positioning */
  .cover--3d .front {
    transform: rotateY(0deg) translateZ(var(--halfSpineWidth));
  }
  .cover--3d .back {
    transform: rotateY(180deg) translateZ(var(--halfSpineWidth));
  }
  .cover--3d .right {
    transform: rotateY(90deg) translateZ(var(--halfBookWidth));
  }
  .cover--3d .spine {
    transform: rotateY(-90deg) translateZ(var(--halfBookWidth));
  }
  .cover--3d .top {
    transform: rotateX(90deg) translateZ(var(--halfBookHeight));
  }
  .cover--3d .bottom {
    transform: rotateX(-90deg) translateZ(var(--halfBookHeight));
  }

  /* perspective classes */
  .cover--3d.cover--3d--front .cover {
    transform: translateZ(-var(--halfSpineWidth)) rotateY(0deg);
  }
  .cover--3d.cover--3d--back .cover {
    transform: translateZ(-var(--halfSpineWidth)) rotateY(180deg);
  }
  .cover--3d.cover--3d--right .cover {
    transform: translateZ(-var(--halfBookWidth)) rotateY(-90deg);
  }
  .cover--3d.cover--3d--angle-front .cover {
    transform: translateZ(-var(--halfBookWidth)) rotateY(40deg);
  }
  .cover--3d.cover--3d--angle-back .cover {
    transform: translateZ(-var(--halfBookWidth)) rotateY(140deg);
  }
  .cover--3d.cover--3d--spine .cover {
    transform: translateZ(-var(--halfBookWidth)) rotateY(90deg);
  }
  .cover--3d.cover--3d--top .cover {
    transform: translateZ(-var(--halfBookHeight)) rotateX(-90deg);
  }
  .cover--3d.cover--3d--bottom .cover {
    transform: translateZ(-var(--halfBookHeight)) rotateX(90deg);
  }

  .cover--3d .front,
  .cover--3d .spine,
  .cover--3d .back {
    background: white;
  }

  .cover--3d .cover-mask {
    display: none;
  }

  .cover--3d {
    cursor: pointer;
    perspective: 2000px;
  }

  .cover--3d .bg-block {
    display: none;
  }

  .top,
  .bottom,
  .right {
    background: #f5f4ee;
    display: none;
  }

  .right {
    height: var(--bookHeight);
    width: var(--spineWidth);
  }

  .top,
  .bottom {
    height: var(--spineWidth);
    width: var(--bookWidth);
  }

  .cover--3d .top,
  .cover--3d .bottom,
  .cover--3d .right {
    display: block;
  }

  .cover--3d .front::before,
  .cover--3d .back::before,
  .cover--3d .spine::before {
    content: ' ';
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 83%;
    background: var(--bgColor);
  }

  .cover--3d--angle-front .spine::before {
    width: 100.18%;
  }

  .cover--3d .guide--spine-left,
  .cover--3d .guide--spine-right,
  .cover--3d .guide--trim-bleed {
    display: none;
  }
`;

export default threeDCss;
