import React from 'react';
import { CoverProps } from '@friends-library/types';
import { overridable, getHtmlFragments, prepareAuthor } from './helpers';
import { dynamifyCss } from './css/helpers';
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
  | 'scope'
  | 'scaler'
> & {
  style?: { [k in string]: number | string };
};

const FrontInner: React.FC<Props> = props => {
  const { lang, author, style, customHtml, customCss, title, isCompilation } = props;
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
            <h2 className="author__name">
              {prepareAuthor(author, title, isCompilation, lang)}
            </h2>
          </div>,
        )}
      </div>
      {customCss && (
        <style>
          {dynamifyCss(
            customCss.replace(/__id__/g, `Cover--${props.isbn}.Cover`),
            props.scope,
            props.scaler,
          )}
        </style>
      )}
    </div>
  );
};

export default FrontInner;
