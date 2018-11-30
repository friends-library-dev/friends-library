const { getAllFriends, getFriend } = require('./friends/es5');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // const allFriends = getAllFriends();
  const allFriends = [getFriend('rebecca-jones')];
  allFriends.forEach(friend => {
    console.log(createNodeId(friend.slug));
    console.log(JSON.stringify(friend));
    createNode({
      id: createNodeId(friend.slug),
      parent: null,
      children: [],
      internal: {
        type: 'Friend',
        content: JSON.stringify(friend),
        contentDigest: createContentDigest(friend),
      },
    });
  });
}
