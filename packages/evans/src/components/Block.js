// @flow
import * as React from 'react';
import { css } from 'glamor';

const element = css`
  padding: 15px;
`;

type Props = {|
  className?: string,
  children: React.Node,
|};

const Block = ({ children, className }: Props) => (
  <section className={`${element}${className ? ` ${className}` : ''}`}>
    {children}
  </section>
);

Block.defaultProps = {
  className: '',
};

export default Block;
