import React from 'react';
import cx from 'classnames';
import { CoverProps } from '@friends-library/types';
import { Front } from '@friends-library/cover-component';
import Link from 'gatsby-link';
import './RelatedBookCard.css';

type Props = Omit<CoverProps, 'size' | 'pages' | 'blurb' | 'isbn'> & {
  description: string;
  authorSlug: string;
  documentSlug: string;
};

const RelatedBookCard: React.FC<Props> = props => {
  return (
    <div className="RelatedBookCard md:mb-24 xl:bg-white xl:max-w-xl">
      <TitleSection {...props} className="hidden xl:block pt-6 pb-4 text-center" />
      <div className="md:flex md:px-8 md:bg-white">
        <div className="book-wrap flex flex-col items-center xl:absolute">
          <Front
            className="shadow-direct xl:hidden"
            {...props}
            size="m"
            scope="1-3"
            scaler={1 / 3}
          />
          <Front
            className="shadow-direct hidden xl:block"
            {...props}
            size="m"
            scope="1-4"
            scaler={1 / 4}
          />
        </div>
        <div className="p-8 bg-white xl:pt-0">
          <TitleSection {...props} className="xl:hidden" />
          <p className="description font-serif antialiased text-sm leading-relaxed">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelatedBookCard;

const TitleSection: React.FC<
  Pick<Props, 'title' | 'authorSlug' | 'author'> & { className: string }
> = ({ title, authorSlug, author, className }) => {
  return (
    <div className={cx(className)}>
      <h4 className="tracking-wider mb-2">{title}</h4>
      <h5 className="text-flprimary mb-6 font-bold antialiased text-sm">
        <Link className="fl-underline" to={authorSlug}>
          {author}
        </Link>
      </h5>
    </div>
  );
};