import React from 'react';
import cx from 'classnames';
import { LANG } from './env';
import Button from './Button';
import './MultiPill.css';

interface Props {
  className?: string;
  buttons: {
    text: string;
    icon?: string;
    onClick?: () => any;
  }[];
}

const WIDTH_MAP = {
  en: [280, 280, 280],
  es: [250, 305, 285],
} as const;

const MultiPill: React.FC<Props> = ({ buttons, className }) => (
  <div className={cx(className, `MultiPill md:flex`)}>
    {buttons.map((button, idx) => (
      <Button
        key={button.text}
        {...(button.onClick ? { onClick: button.onClick } : {})}
        width={WIDTH_MAP[LANG][idx]}
        bg={null}
        className={cx(
          // purgeCSS: bg-flmaroon-600 bg-flmaroon-500 bg-flmaroon-400
          // purgeCSS: bg-flgold-600 bg-flgold-500 bg-flgold-400
          `bg-fl${LANG === `en` ? `maroon` : `gold`}-${[600, 500, 400][idx]}`,
          // purgeCSS: z-30 z-20 z-10
          `z-${[30, 20, 10][idx]}`,
          {
            'mb-2': idx < buttons.length - 1,
            'md:pl-6': idx > 0,
          },
        )}
      >
        {/* purgeCSS: fa-cloud fa-book fa-headphones */}
        {button.icon && <i className={`fa fa-${button.icon} pr-3`} />}
        <span>{button.text}</span>
      </Button>
    ))}
  </div>
);

export default MultiPill;
