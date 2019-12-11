import React from 'react';
import { withTheme } from 'emotion-theming';

/* height, width, radius, margin */
const Component: React.FC<{ msg: string }> = ({ msg }) => (
  <div>
    <svg viewBox="0 0 32 10">
      <circle cx="10" cy="4" r="1">
        <Animate begin="0" />
      </circle>
      <circle cx="16" cy="4" r="1">
        <Animate begin="0.3" />
      </circle>
      <circle cx="22" cy="4" r="1">
        <Animate begin="0.6" />
      </circle>
    </svg>
    <p>{msg}</p>
  </div>
);

export default withTheme(Component);

const Animate: React.FC<{ begin: string }> = ({ begin }) => (
  <animate
    attributeName="r"
    values="1; 3; 1; 1"
    dur="1.2s"
    repeatCount="indefinite"
    begin={begin}
    keyTimes="0;0.2;0.7;1"
    keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
    calcMode="spline"
  />
);
