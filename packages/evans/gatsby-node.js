require('ts-node').register();

exports.sourceNodes = require('./src/build/source-nodes').default;
exports.createPagesStatefully = require('./src/build/create-pages-statefully').default;
exports.createPages = require('./src/build/create-pages').default;
exports.onCreatePage = require('./src/build/on-create-page').default;
exports.onCreateDevServer = require('./src/build/on-create-dev-server').default;
exports.onPostBuild = require('./src/build/on-post-build').default;
exports.createSchemaCustomization = require('./src/build/create-schema-customization').default;
