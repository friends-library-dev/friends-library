const path = require('path');
const getWorkspaces = require('get-yarn-workspaces');
const blacklist = require('metro-config/src/defaults/blacklist');

const monorepoRoot = path.resolve(__dirname, `..`, `..`);
const workspaces = getWorkspaces(monorepoRoot).filter((ws) =>
  ws.startsWith(`${monorepoRoot}/packages/`),
);

module.exports = {
  projectRoot: path.resolve(monorepoRoot, 'packages/app'),

  watchFolders: [
    path.resolve(monorepoRoot, 'node_modules'),
    path.resolve(__dirname, 'node_modules'),
    ...workspaces,
  ],

  resolver: {
    blacklistRE: blacklist([/node_modules\/.*\/node_modules\/react-native\/.*/]),

    // https://github.com/facebook/metro/issues/1#issuecomment-453450709
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(monorepoRoot, `node_modules/${name}`),
      },
    ),
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
