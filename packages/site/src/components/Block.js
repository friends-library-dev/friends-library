// @flow
import * as React from 'react';
import styled from '@emotion/styled';

type Props = {|
  className?: string,
  css?: *,
  children: React.Node,
|};

const BlockSection = styled.section`
  padding: 15px;
`;

const Block = ({ children, className, css }: Props) => (
  <BlockSection className={className} css={css}>
    {children}
  </BlockSection>
);

Block.defaultProps = {
  className: '',
  css: null,
};

export default Block;
