import React from 'react';
import { LANG } from './env';

interface Props {
  className?: string;
  href?: string;
  children: [JSX.Element, JSX.Element];
  el?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'a';
}

type PartialProps = Omit<Props, 'el'>;

const DualComponent: React.FC<Props> = (props) => {
  const { el, children, ...forwardProps } = props;
  const Tag = el;
  const useChildren = children[LANG === `en` ? 0 : 1];
  if (!Tag) return <React.Fragment>{useChildren}</React.Fragment>;
  return <Tag {...forwardProps}>{useChildren}</Tag>;
};

const P: React.FC<PartialProps> = (props) => <DualComponent el="p" {...props} />;
const A: React.FC<PartialProps> = (props) => <DualComponent el="a" {...props} />;
const Span: React.FC<PartialProps> = (props) => <DualComponent el="span" {...props} />;
const H1: React.FC<PartialProps> = (props) => <DualComponent el="h1" {...props} />;
const H2: React.FC<PartialProps> = (props) => <DualComponent el="h2" {...props} />;
const H3: React.FC<PartialProps> = (props) => <DualComponent el="h3" {...props} />;
const H4: React.FC<PartialProps> = (props) => <DualComponent el="h4" {...props} />;
const Frag: React.FC<PartialProps> = (props) => <DualComponent {...props} />;

export default {
  P,
  A,
  H1,
  H2,
  H3,
  H4,
  Span,
  Frag,
};
