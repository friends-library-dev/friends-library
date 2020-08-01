import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { MultiBookBgBlock } from '@friends-library/ui';

type Props = Omit<React.ComponentProps<typeof MultiBookBgBlock>, 'bgImg'>;

const BooksBgBlock: React.FC<Props> = (props) => {
  const data = useStaticQuery(graphql`
    query BooksBgBlock {
      books: file(relativePath: { eq: "explore-books.jpg" }) {
        image: childImageSharp {
          fluid(quality: 90, maxWidth: 825) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `);
  return <MultiBookBgBlock bgImg={data.books.image.fluid} {...props} />;
};

export default BooksBgBlock;
