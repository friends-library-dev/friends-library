import React from 'react';
import cx from 'classnames';

interface Props {
  top: number;
  left: number;
  label: string;
  className?: string;
  tailwindColor?: string;
  onClick?: (label: any) => any;
}

const LocationMarker: React.FC<Props> = ({
  className,
  top,
  left,
  label,
  onClick = () => {},
  tailwindColor = `flprimary`,
}) => (
  <>
    <svg
      className={cx(className, `absolute`)}
      style={{ top: `${top}%`, left: `${left}%`, transform: `translate(-12px, -36px)` }}
      width="26"
      height="37"
      viewBox="0 0 26 37"
      onClick={() => onClick(label)}
    >
      <path
        className={`text-${tailwindColor} fill-current`}
        d="M12.9998349,68 C5.81979911,68 0,73.7974889 0,80.95 C0,83.7458844 0.907594824,86.9530444 2.43422941,89.0904111 L13,105 L23.5657706,89.0904111 C25.0924052,86.9529622 26,83.7879 26,80.95 C26,73.7974889 20.1802009,68 13.0001651,68 L12.9998349,68 Z M12.9998349,85.8833333 C10.2753997,85.8833333 8.04751686,83.6639911 8.04751686,80.95 C8.04751686,78.2360089 10.2753997,76.0166667 12.9998349,76.0166667 C15.7242702,76.0166667 17.952153,78.2360089 17.952153,80.95 C17.952153,83.6639911 15.7242702,85.8833333 12.9998349,85.8833333 Z"
        transform="translate(0 -68)"
      />
    </svg>
    <label
      onClick={() => onClick(label)}
      className={`text-${tailwindColor} uppercase whitespace-no-wrap sans text-xs font-bold absolute`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, 25%)`,
        textShadow: `1px 1px white, -1px -1px white`,
      }}
    >
      {label}
    </label>
  </>
);

export default LocationMarker;
