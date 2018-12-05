const { getAllFriends, getFriend } = require('./friends/es5');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  getAllFriends().forEach(friend => {
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
      documents: friend.documents,
    });
  });
}
