import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import Header from './Header';
import Button from '../Button';

export interface Props {
  recommendedBooks: {
    Cover: JSX.Element;
    title: string;
    path: string;
  }[];
}

const EmptyCart: React.FC<Props> = ({ recommendedBooks }) => {
  return (
    <div>
      <Header>Empty Cart</Header>
      <p className="body-text text-center">
        There's nothing in your cart! Below are a few recommendations, or you can check
        out our{' '}
        <Link to="/getting-started" className="subtle-link">
          getting started picks
        </Link>
        , or{' '}
        <Link to="/explore" className="subtle-link">
          explore all the books
        </Link>
        .
      </p>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start mt-8 px-6">
        {recommendedBooks.map(({ Cover, title, path }, idx) => (
          <Link
            to={path}
            key={title}
            className={cx(
              'flex flex-col items-center hover:underline mb-6 md:flex md:w-1/3',
              {
                hidden: idx > 1,
              },
            )}
          >
            {Cover}
            <h3 className="font-sans text-center mt-4 text-lg text-gray-800 tracking-wide">
              {title}
            </h3>
          </Link>
        ))}
      </div>
      <Button to="/explore" className="mx-auto mt-4" shadow>
        Explore Books
      </Button>
    </div>
  );
};

export default EmptyCart;
