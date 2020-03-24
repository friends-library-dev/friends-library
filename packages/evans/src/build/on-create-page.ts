import { GatsbyNode, CreatePageArgs } from 'gatsby';
import { LANG } from '../env';

const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}: CreatePageArgs) => {
  if (LANG === 'en') {
    return;
  }
  const { createPage, deletePage } = actions;
  const oldPage = { ...page };
  switch (page.path) {
    case '/contact/':
      page.path = '/contactanos/';
      break;
    case '/getting-started/':
      page.path = '/comenzar/';
      break;
    case '/explore/':
      page.path = '/explorar/';
      break;
    case '/friends/':
      page.path = '/amigos/';
      break;
    case '/audiobooks/':
      page.path = '/audiolibros/';
      break;
  }

  // got this from here: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-remove-trailing-slashes/src/gatsby-node.js
  if (page.path !== oldPage.path) {
    // @ts-ignore
    deletePage(oldPage);
    // @ts-ignore
    createPage(page);
  }
};

export default onCreatePage;
