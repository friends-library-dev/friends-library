import React from 'react';
import { styled } from '@friends-library/ui';

interface Props {
  className?: string;
  css?: any;
  children: React.ReactNode;
}

const BlockSection = styled.section`
  padding: 15px;
`;

const Block: React.FC<Props> = ({ children, className, css }) => (
  <BlockSection className={className} css={css}>
    {children}
  </BlockSection>
);

Block.defaultProps = {
  className: '',
  css: null,
};

export default Block;
