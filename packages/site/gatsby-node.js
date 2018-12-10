const path = require('path');

const FriendPage = path.resolve('src/templates/FriendPage.js');
const DocumentPage = path.resolve('src/templates/DocumentPage.js');
const AudioPage = path.resolve('src/templates/AudioPage.js');

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
    });

    document.editions.forEach(edition => {
      edition.formats.forEach(format => {
        if (format.type === 'audio') {
          createPage({
            path: format.url,
            component: AudioPage,
            context: {
              friendSlug: node.slug,
              documentSlug: document.slug,
              editionType: edition.type,
            }
          });
        }
      });
    });
  });
}
