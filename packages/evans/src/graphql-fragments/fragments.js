import { graphql } from 'gatsby';

export const CoverCode = graphql`
  fragment CoverCode on Edition {
    customCode {
      css {
        paperback_cover
      }
      html {
        paperback_cover
      }
    }
  }
`;
