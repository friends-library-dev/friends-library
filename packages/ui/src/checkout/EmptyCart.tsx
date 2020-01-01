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
        There's nothing in your cart! See our wide variety of books available on our site.
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
      <Button className="bg-flprimary mx-auto mt-4">Explore Books</Button>
    </div>
  );
};

export default EmptyCart;
