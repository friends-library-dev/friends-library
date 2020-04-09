import React from 'react';
import cx from 'classnames';
import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import BooksBgBlock from '../components/BooksBgBlock';
import { Layout, Seo } from '../components';
import { SiteMetadata } from '../types';

interface Props {
  data: {
    site: SiteMetadata;
    audioBooks: {
      totalCount: number;
    };
    mdx: {
      body: string;
      frontmatter: {
        title: string;
      };
    };
  };
}

const components: { [key: string]: React.FC } = {
  h2: ({ children }) => (
    <h2
      className={cx(
        'bg-flprimary text-white font-sans text-2xl bracketed tracking-widest',
        'my-12 -mx-10 py-4 px-10',
        'sm:text-3xl',
        'md:-mx-16 md:px-16 ',
        'lg:-mx-24 lg:px-24',
      )}
    >
      {children}
    </h2>
  ),

  p: ({ children }) => (
    <p className="mb-6 pb-1 text-base sm:text-lg leading-loose">{children}</p>
  ),

  li: ({ children }) => <li className="py-2">{children}</li>,

  h3: ({ children }) => (
    <h3 className="font-sans text-flprimary mb-2 text-2xl">{children}</h3>
  ),

  a: props => (
    <a className="text-flprimary fl-underline" {...props}>
      {props.children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote
      className={cx(
        'italic tracking-wider bg-flgray-100 leading-loose',
        'py-4 px-8 my-8',
      )}
    >
      {children}
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul
      className={cx(
        'diamonds leading-normal bg-flgray-100 text-base sm:text-lg',
        'py-4 px-16 mb-8',
      )}
    >
      {children}
    </ul>
  ),

  Lead: ({ children }) => (
    <p className={cx('text-xl sm:text-2xl pb-4 pt-2 leading-loose')}>{children}</p>
  ),
};

const StaticPage: React.FC<Props> = ({ data }) => {
  const { mdx, audioBooks, site } = data;
  const { body, frontmatter } = mdx;
  return (
    <Layout>
      <Seo title={frontmatter.title} />
      <BooksBgBlock bright>
        <h1
          className="max-w-screen-md mx-auto px-6 py-16 heading-text text-2xl sm:text-4xl bracketed text-flprimary"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
        >
          {frontmatter.title}
        </h1>
      </BooksBgBlock>
      <div className="MDX p-10 md:px-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
        <MDXProvider components={components}>
          <MDXRenderer>
            {body
              .replace(/%AUDIOBOOK_COUNT%/g, String(audioBooks.totalCount))
              .replace(/%NUM_SPANISH_BOOKS%/g, String(site.meta.numSpanishBooks))
              .replace(/%NUM_ENGLISH_BOOKS%/g, String(site.meta.numEnglishBooks))
              .replace(/ -- /g, ' — ')}
          </MDXRenderer>
        </MDXProvider>
      </div>
    </Layout>
  );
};

export default StaticPage;

export const pageQuery = graphql`
  query($path: String!) {
    site {
      ...SiteMetadata
    }
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      totalCount
    }
    mdx(frontmatter: { path: { eq: $path } }) {
      body
      frontmatter {
        title
      }
    }
  }
`;
