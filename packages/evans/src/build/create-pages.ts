import path from 'path';
import { GatsbyNode, CreatePagesArgs } from 'gatsby';

const StaticPageTemplate = path.resolve(`./src/templates/StaticPage.tsx`);

const createPages: GatsbyNode['createPages'] = async ({
  actions: { createPage },
  graphql,
  reporter,
}: CreatePagesArgs) => {
  const result = await graphql(`
    {
      allMdx(limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // @ts-ignore
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: StaticPageTemplate,
      context: {}, // additional data can be passed via context
    });
  });
};

export default createPages;
