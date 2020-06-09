import React from 'react';
import cx from 'classnames';

interface Props {
  tailwindColor?: string;
  className?: string;
}

const Rotate: React.FC<Props> = ({ tailwindColor = `flprimary`, className }) => {
  return (
    <svg
      className={cx(className, `inline-block`)}
      width="32"
      height="18"
      viewBox="0 0 32 18"
    >
      <path
        className={cx(`text-${tailwindColor}`, `fill-current`)}
        d="M16.0000337,0 C8.25264895,0 0,2.47476357 0,7.05094743 C0,11.1186061 6.50140316,13.5259822 13.3723229,13.9998644 L11.6210097,15.7966849 C11.1157455,16.3051422 11.1157455,17.1181316 11.6210097,17.6265889 C11.856537,17.8636046 12.193373,18 12.5302159,18 C12.8670587,18 13.1696783,17.8649402 13.439422,17.6265889 L17.2460826,13.728416 C17.7513468,13.2199586 17.7513468,12.4069693 17.2460826,11.8985119 L13.4067482,8.06779431 C12.901484,7.55933697 12.0936002,7.55933697 11.588336,8.06779431 C11.0830718,8.57625165 11.0830718,9.38924104 11.588336,9.89769838 L13.1383519,11.4575099 C6.56991699,10.9490526 2.52780322,8.6782143 2.52780322,7.08545473 C2.52780322,5.25555066 7.78322481,2.57679401 15.9671578,2.57679401 C24.1854488,2.57679401 29.4065124,5.25412698 29.4065124,7.08545473 C29.4065124,8.40690146 26.6775467,10.271245 21.592096,11.1185384 C20.8841871,11.2204942 20.4473694,11.8984441 20.5473443,12.6094709 C20.7157657,13.2542965 21.3894513,13.7283482 22.063137,13.6263855 C28.294729,12.5750314 32,10.1017593 32,7.05101522 C32,2.47489916 23.747351,0 15.9999663,0 L16.0000337,0 Z"
      />
    </svg>
  );
};

export default Rotate;
