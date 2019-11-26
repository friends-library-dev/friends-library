import React from 'react';
import { CoverProps } from '@friends-library/types';
import { overridable, getHtmlFragments } from './helpers';
import LogoIcon from './LogoIcon';
import FrontMain from './FrontMain';

type Props = Pick<
  CoverProps,
  | 'customCss'
  | 'isbn'
  | 'customHtml'
  | 'lang'
  | 'author'
  | 'showGuides'
  | 'title'
  | 'isCompilation'
> & {
  style?: { [k in string]: number | string };
};

const FrontInner: React.FC<Props> = props => {
  const { lang, author, style, isCompilation, customHtml, customCss } = props;
  const fragments = getHtmlFragments(customHtml);
  return (
    <div className="front has-bg" style={style || {}}>
      <div className="front__safe">
        <div className="top-row">
          <span className="flp">
            {lang === 'es' ? 'Biblioteca de los Amigos' : 'Friends Library Publishing'}
          </span>
          <LogoIcon />
        </div>
        <FrontMain {...props} />
        {overridable(
          'author',
          fragments,
          <div className="author">
            <div className="author__line" />
            <h2 className="author__name" style={isCompilation ? { opacity: 0 } : {}}>
              {author}
            </h2>
          </div>,
        )}
      </div>
      {customCss && <style>{customCss.replace(/__id__/g, `Cover--${props.isbn}`)}</style>}
    </div>
  );
};

export default FrontInner;
