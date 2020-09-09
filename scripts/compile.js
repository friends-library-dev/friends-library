// @ts-check
const { execSync } = require(`child_process`);

const [, , pkg, ...rest] = process.argv;

const pkgs = [
  `adoc-utils`,
  `adoc-lint`,
  `adoc-convert`,
  `doc-manifests`,
  `doc-html`,
  `doc-css`,
  `doc-artifacts`,
  `cover-web-app`,
  `document-meta`,
  `cover-component`,
  `dpc-fs`,
  `lulu`,
  `locale`,
  `env`,
  `color`,
  `ui`,
  `evans`,
  `cli-utils`,
  `cloud`,
  `slack`,
  `jones`,
  `friends`,
  `hilkiah`,
  `types`,
  `styleguide`,
  `fell`,
  `db`,
  `all`,
];

if (!pkg || pkgs.includes(pkg) === false) {
  throw new Error(`Invalid package for compilation: ${pkg}`);
}

if (pkg === `all`) {
  pkgs.filter((p) => p !== `all`).forEach(compilePkg);
} else if (pkg === `evans`) {
  // funky implicit dependency on non-composite package
  // but keeping `ui` non-composite seems to GREATLY help
  // webpack tree-shaking
  compilePkg(`ui`);
  compilePkg(pkg);
} else {
  compilePkg(pkg);
}

function compilePkg(pkg) {
  let args = rest.length ? ` ${rest.join(` `)}` : ``;
  let cmd = `yarn tsc --build packages/${pkg}${args}`;

  // always use verbose output on netlify / ci
  if (process.env.COMMIT_REF || process.env.CI) {
    args += ` --verbose`;
  }

  execSync(cmd, { cwd: process.cwd(), stdio: `inherit` });
}
