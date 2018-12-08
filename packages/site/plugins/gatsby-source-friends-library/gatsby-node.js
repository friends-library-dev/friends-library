const { getAllFriends, getFriend } = require('./friends/es5');

const LANG = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  getAllFriends(LANG).forEach(friend => {
    console.log(`Create friend node: ${friend.slug}`);
    createNode({
      id: createNodeId(friend.slug),
      parent: null,
      children: [],
      internal: {
        type: 'Friend',
        content: JSON.stringify(friend),
        contentDigest: createContentDigest(friend),
      },
      ...friend,
      url: friend.url(),
      documents: friend.documents.map(doc => {
        doc.friend = friend;
        return {
          slug: doc.slug,
          title: doc.title,
          hasAudio: doc.hasAudio(),
          hasUpdatedEdition: doc.hasUpdatedEdition(),
          shortestEdition: (({ pages }) => ({ pages }))(doc.shortestEdition()),
          tags: doc.tags,
          url: doc.url(),
        };
      }),
    });
  });
}
