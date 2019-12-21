import React from 'react';

const MessageThrobber: React.FC = () => (
  <div className="absolute w-40 top-0 hcenter z-50 mt-16">
    <svg viewBox="2 0 21 8" className="text-flprimary fill-current">
      <circle cx="6" cy="4" r="1">
        <Animate begin="0" />
      </circle>
      <circle cx="12" cy="4" r="1">
        <Animate begin="0.3" />
      </circle>
      <circle cx="18" cy="4" r="1">
        <Animate begin="0.6" />
      </circle>
    </svg>
  </div>
);

export default MessageThrobber;

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
