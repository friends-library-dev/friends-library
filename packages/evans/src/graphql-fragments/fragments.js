import { graphql } from 'gatsby';

export const CoverCode = graphql`
  fragment CoverCode on Edition {
    code: customCode {
      css {
        cover: paperback_cover
      }
      html {
        cover: paperback_cover
      }
    }
  }
`;

export const CoverProps = graphql`
  fragment CoverProps on Document {
    title
    author: authorName
    isCompilation
    editions {
      size: printSize
      type
      blurb: paperbackCoverBlurb
      isbn
      pages
      ...CoverCode
    }
  }
`;

export const RecommendedBook = graphql`
  fragment RecommendedBook on Document {
    url
    authorUrl
    hasAudio
    htmlShortTitle
    ...CoverProps
  }
`;

export const SiteMetadata = graphql`
  fragment SiteMetadata on Site {
    meta: siteMetadata {
      numSpanishBooks
      numEnglishBooks
    }
  }
`;
