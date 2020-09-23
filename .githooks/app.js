// @ts-check
const path = require(`path`);
const fs = require(`fs`);

const MONO_REPO_ROOT = path.resolve(__dirname, `..`);
const XCODE_PROJ_PATH = `${MONO_REPO_ROOT}/packages/app/ios/FriendsLibrary.xcodeproj/project.pbxproj`;

function restoreBundleIdentifier() {
  const fileContents = fs.readFileSync(XCODE_PROJ_PATH, `utf8`);
  fs.writeFileSync(
    XCODE_PROJ_PATH,
    fileContents.replace(
      /(\t+)PRODUCT_BUNDLE_IDENTIFIER([^;]+)/g,
      `$1PRODUCT_BUNDLE_IDENTIFIER = "com.friendslibrary.$(PRODUCT_NAME:rfc1034identifier)"`,
    ),
  );
}

module.exports = { restoreBundleIdentifier };
