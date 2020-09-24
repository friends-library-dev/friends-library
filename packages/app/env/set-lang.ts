import fs from 'fs';
import path from 'path';
import { Lang } from '@friends-library/types';
import { MAROON_HEX, GOLD_HEX } from '@friends-library/color';
import exec from './exec';
import { BUILD_SEMVER_STRING, BUILD_NUM } from './build-constants';

const LANG: Lang = process.argv[2] === `es` ? `es` : `en`;
const ENV_DIR = __dirname;
const APP_DIR = path.resolve(ENV_DIR, `..`);
const ENV = `${ENV_DIR}/index.ts`;
const APP_NAME = LANG === `en` ? `Friends Library` : `Biblioteca de los Amigos`;
const PRIMARY_COLOR_HEX = LANG === `en` ? MAROON_HEX : GOLD_HEX;
const SPLASH_ICON_WIDTH = LANG === `en` ? 200 : 239;

const BUILD_TYPE: `release` | `beta` =
  exec.exit(`git branch --show-current`) === `master` ? `release` : `beta`;

const APP_IDENTIFIER = getAppIdentifier();

function main(): void {
  exec.exit(`printf "import { Lang } from '@friends-library/types';\n\n" > ${ENV}`);
  exec.exit(`echo "export const LANG: Lang = '${LANG}';" >> ${ENV}`);
  exec.exit(`cat ${ENV_DIR}/build-constants.ts >> ${ENV}`);
  exec.exit(`echo "export const PRIMARY_COLOR_HEX = '${PRIMARY_COLOR_HEX}';" >> ${ENV}`);
  exec.exit(`echo "export const APP_NAME = '${APP_NAME}';" >> ${ENV}`);

  copyFileWithEnv(`android/colors.xml`, `android/app/src/main/res/values/colors.xml`);
  copyFileWithEnv(`android/strings.xml`, `android/app/src/main/res/values/strings.xml`);
  copyFileWithEnv(`ios/Info.plist`, `ios/FriendsLibrary/Info.plist`);
  copyFileWithEnv(
    `ios/${LANG}/LaunchScreen.storyboard`,
    `ios/FriendsLibrary/LaunchScreen.storyboard`,
  );

  copyDir(`ios/${LANG}/AppIcon.appiconset`, `ios/FriendsLibrary/Images.xcassets`);
  copyDir(`ios/${LANG}/SplashIcon.imageset`, `ios/FriendsLibrary/Images.xcassets`);

  const resDirs = [
    `drawable`,
    `mipmap-hdpi`,
    `mipmap-mdpi`,
    `mipmap-xhdpi`,
    `mipmap-xxhdpi`,
    `mipmap-xxxhdpi`,
  ];
  resDirs.forEach((dir) => copyDir(`android/${LANG}/${dir}`, `android/app/src/main/res`));

  const workspacePath = `${APP_DIR}/ios/FriendsLibrary.xcodeproj/project.pbxproj`;
  const workspaceCode = fs.readFileSync(workspacePath, `utf8`);
  const updatedCode = workspaceCode.replace(
    /PRODUCT_BUNDLE_IDENTIFIER = "com\.friendslibrary\..+";/g,
    `PRODUCT_BUNDLE_IDENTIFIER = "${APP_IDENTIFIER}";`,
  );
  fs.writeFileSync(workspacePath, updatedCode);
}

function copyDir(src: string, dest: string): void {
  if (!dest) throw new Error(`Unexpected unsafe destination!`);
  const destPath = `${APP_DIR}/${dest}`;
  exec.exit(`rm -rf ${destPath}/${src.split(`/`).pop()}`);
  exec.exit(`mkdir -p ${destPath}`);
  exec.exit(`cp -r ${ENV_DIR}/files/${src} ${destPath}`);
}

function copyFileWithEnv(src: string, dest: string): void {
  let code = fs.readFileSync(`${ENV_DIR}/files/${src}`, `utf8`);

  const replacements = [
    [`{PRIMARY_COLOR_HEX}`, PRIMARY_COLOR_HEX],
    [`{APP_NAME}`, APP_NAME],
    [`{BUILD_SEMVER_STRING}`, BUILD_SEMVER_STRING],
    [`{BUILD_NUM}`, String(BUILD_NUM)],
    [`{ALLOW_INSECURE_LOCALHOST}`, ALLOW_INSECURE_LOCALHOST],
    [`{APP_IDENTIFIER}`, APP_IDENTIFIER],
    [`{SPLASH_ICON_WIDTH}`, String(SPLASH_ICON_WIDTH)],
  ];
  replacements.forEach(([pattern, value]) => {
    code = code.replace(new RegExp(pattern, `g`), value);
  });

  let generatedComment = ``;
  if (src.endsWith(`.xml`) || src.endsWith(`.plist`)) {
    generatedComment = `<!-- AUTO-GENERATED DO NOT EDIT -->`;
  }

  // insert comment on second line (comments not valid above xml declaration)
  const lines = code.split(`\n`);
  lines[0] = `${lines[0]}${generatedComment ? `\n${generatedComment}` : ``}`;
  code = lines.join(`\n`);

  fs.writeFileSync(`${APP_DIR}/${dest}`, code);
}

function getAppIdentifier(): string {
  const base = `com.friendslibrary.FriendsLibrary`;
  if (LANG === `en` && BUILD_TYPE === `beta`) {
    return base; // legacy initial testflight english id
  }
  return `${base}.${LANG}.${BUILD_TYPE}`;
}

const ALLOW_INSECURE_LOCALHOST = process.argv.includes(`--release`)
  ? `<!-- omit localhost http exception for release -->`
  : `<key>NSExceptionDomains</key>
       <dict>
         <key>localhost</key>
         <dict>
           <key>NSExceptionAllowsInsecureHTTPLoads</key>
           <true/>
         </dict>
       </dict>`;

main();
