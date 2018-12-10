const path = require('path');

const FriendPage = path.resolve('src/templates/FriendPage.js');
const DocumentPage = path.resolve('src/templates/DocumentPage.js');

exports.onCreateNode = ({ node, actions: { createPage } }) => {
  if (node.internal.type !== 'Friend') {
    return;
  }

  createPage({
    path: node.url,
    component: FriendPage,
    context: {
      slug: node.slug,
    },
  });

  node.documents.forEach(document => {
    createPage({
      path: document.url,
      component: DocumentPage,
      context: {
        friendSlug: node.slug,
        documentSlug: document.slug,
      }
    })
  });
}
