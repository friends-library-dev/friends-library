import React from 'react';
import { overridable, prepareTitle } from './helpers';
import LogoIcon from './LogoIcon';
import Diamonds from './Diamonds';
import { CoverProps, EditionType, Lang } from '@friends-library/types';

const Spine: React.FC<CoverProps> = ({
  lang,
  edition,
  title,
  pages,
  author,
  showGuides,
}) => {
  const Diamond = Diamonds[lang === 'es' ? 'spanish' : edition];
  const fragments = {};
  return (
    <div className={spineClasses(pages, edition, lang)}>
      <LogoIcon />
      <Diamond />
      {overridable(
        'spine__title',
        fragments,
        <div
          className="spine__title"
          dangerouslySetInnerHTML={{ __html: prepareTitle(title, author) }}
        />,
      )}
      {overridable(
        'spine__author',
        fragments,
        <div className="spine__author">{author.split(' ').pop()}</div>,
      )}
      {showGuides && (
        <div className="guide guide--spine guide--vertical guide--spine-center" />
      )}
    </div>
  );
};
export default Spine;

function spineClasses(pages: number, edition: EditionType, lang: Lang): string {
  const classes = ['spine has-bg'];
  const rounded = Math.floor(pages / 10) * 10;
  for (let i = 120; i <= 180; i += 20) {
    rounded < i && classes.push(`spine--pgs-lt-${i}`);
  }
  return classes.join(' ');
}
