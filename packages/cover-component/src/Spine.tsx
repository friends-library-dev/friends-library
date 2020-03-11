import React from 'react';
import { overridable, prepareTitle, getHtmlFragments } from './helpers';
import LogoIcon from './LogoIcon';
import Diamonds from './Diamonds';
import { CoverProps } from '@friends-library/types';
import { pdfSpineWidth, spineAuthorDisplay } from './css/helpers';

type Props = Pick<
  CoverProps,
  | 'lang'
  | 'isCompilation'
  | 'edition'
  | 'title'
  | 'pages'
  | 'customHtml'
  | 'author'
  | 'showGuides'
  | 'size'
  | 'scaler'
> & { styles?: { [k in string]: string | number } };

const Spine: React.FC<Props> = ({
  lang,
  edition,
  title,
  pages,
  author,
  showGuides,
  styles,
  isCompilation,
  customHtml,
  size,
  scaler = 1,
}) => {
  const Diamond = Diamonds[lang === 'es' ? 'spanish' : edition];
  const width = pdfSpineWidth(pages) * scaler;
  const style = Object.assign({}, { width: `${width}in` }, styles || {});
  const fragments = getHtmlFragments(customHtml);

  return (
    <div className={spineClasses(pages)} style={style}>
      <LogoIcon />
      <Diamond />
      {overridable(
        'spine__title',
        fragments,
        <div
          className="spine__title"
          dangerouslySetInnerHTML={{ __html: prepareTitle(title, author, 'spine') }}
        />,
      )}
      {overridable(
        'spine__author',
        fragments,
        <div
          className="spine__author"
          style={{
            display: spineAuthorDisplay(title, author, size, isCompilation),
          }}
        >
          {author.split(' ').pop()}
        </div>,
      )}
      {showGuides && (
        <div
          className="guide guide--spine guide--vertical guide--spine-center"
          style={{
            left: `${width / 2}in`,
          }}
        />
      )}
    </div>
  );
};
export default Spine;

function spineClasses(pages: number): string {
  const classes = ['spine has-bg'];
  const rounded = Math.floor(pages / 10) * 10;
  for (let i = 120; i <= 180; i += 20) {
    rounded < i && classes.push(`spine--pgs-lt-${i}`);
  }
  return classes.join(' ');
}
