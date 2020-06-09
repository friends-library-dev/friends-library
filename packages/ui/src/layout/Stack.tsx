import React from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  children: JSX.Element[];
  space: string;
  el?: 'div' | 'ul';
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

const Stack: React.FC<Props> = ({
  className,
  el = `div`,
  children,
  space,
  sm,
  md,
  lg,
  xl,
}) => {
  const Tag = el;
  return (
    <Tag className={className}>
      {children.map((child, idx) => {
        const notLast = idx < children.length - 1;
        return React.cloneElement(child, {
          className: cx(child.props.className, {
            [`mb-${space}`]: notLast,
            [`sm:mb-${sm || ``}`]: notLast && sm,
            [`md:mb-${md || ``}`]: notLast && md,
            [`lg:mb-${lg || ``}`]: notLast && lg,
            [`xl:mb-${xl || ``}`]: notLast && xl,
          }),
        });
      })}
    </Tag>
  );
};

export default Stack;
