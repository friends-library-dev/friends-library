import React from 'react';
import { styled } from '@friends-library/ui';

const Badge = styled.span`
  box-sizing: border-box;
  min-width: 22px;
  height: 22px;
  line-height: 22px;
  padding: 0 5px;
  border-radius: 500px;
  vertical-align: middle;
  background: ${p => p.theme.primary.hex};
  color: #fff;
  font-size: 13.25px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => <Badge>{children}</Badge>;
