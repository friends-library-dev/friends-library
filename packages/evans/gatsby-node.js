require('ts-node').register();

exports.sourceNodes = require('./src/build/source-nodes').default;
exports.onCreateNode = require('./src/build/on-create-node').default;
exports.onCreateDevServer = require('./src/build/on-create-dev-server').default;
exports.onPostBuild = require('./src/build/on-post-build').default;
