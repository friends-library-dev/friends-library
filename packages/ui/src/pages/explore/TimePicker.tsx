import React from 'react';
import cx from 'classnames';
import './TimePicker.css';

interface Props {
  className?: string;
  setSelected: (selected: number) => any;
  selected: number;
}

const dates = [1650, 1675, 1700, 1725, 1750, 1775, 1800, 1825, 1850];

const TimePicker: React.FC<Props> = ({ className, selected, setSelected }) => (
  <div
    className={cx(
      className,
      `TimePicker flex justify-center`,
      `text-white font-sans text-base antialiased`,
      `border-t-4 border-white`,
    )}
  >
    {dates.map((date, idx) => (
      <div
        key={date}
        onClick={() => setSelected(date)}
        className={cx(
          `Date relative cursor-pointer pt-6 pb-1 px-2 sm:block`,
          `text-center hover:font-bold select-none`,
          idx % 2 && `hidden`,
          idx > 0 && idx < dates.length - 1 && `mx-2 sm:mx-auto md:mx-2 lg:mx-6 lg:w-12`,
          selected === date && `Date--selected border-b-4 border-flgold`,
          idx === 0 && `mr-auto`,
          idx === dates.length - 1 && `ml-auto`,
        )}
      >
        {date}
      </div>
    ))}
  </div>
);

export default TimePicker;
