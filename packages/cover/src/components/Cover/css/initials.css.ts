import css from './tmpl';

const initialsCss: string = css`
  .initial--first {
    top: 20%;
  }

  .initial--last {
    top: 47%;
  }

  .initial {
    width: 100%;
    text-align: center;
    position: absolute;
    color: white;
    opacity: 0.25;
    font-size: 2.5in;
    font-weight: 400;
    left: 0;
  }

  .initial--J {
    transform: scaleY(0.88) translateY(-0.22in) translateX(-0.02in);
  }

  .initial--D {
    transform: translateX(-0.1in);
  }
`;

export default initialsCss;
