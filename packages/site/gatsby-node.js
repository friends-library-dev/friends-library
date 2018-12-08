const path = require('path');

exports.onCreateNode = ({ node, actions: { createPage } }) => {
  if (node.internal.type !== 'Friend') {
    return;
  }

  createPage({
    path: node.url,
    component: path.resolve('src/templates/FriendPage.js'),
    context: {
      slug: node.slug,
    },
  });
}
