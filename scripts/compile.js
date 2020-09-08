const { execSync } = require(`child_process`);
const os = require(`os`);

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
  `evans`,
  `cli-utils`,
  `cloud`,
  `slack`,
  `jones`,
  `friends`,
  `hilkiah`,
  `types`,
  `styleguide`,
  `ui`,
  `fell`,
  `db`,
  `color`,
  `all`,
];

if (!pkg || pkgs.includes(pkg) === false) {
  throw new Error(`Invalid package for compilation: ${pkg}`);
}

if (pkg === `all`) {
  pkgs.filter((p) => p !== `all`).forEach(compilePkg);
} else {
  compilePkg(pkg);
}

function compilePkg(pkg) {
  let cwd = process.cwd();
  const opts = { cwd, stdio: `inherit` };

  let args = rest.length ? ` ${rest.join(` `)}` : ``;
  let cmd = `yarn tsc --build packages/${pkg}${args}`;

  // always use verbose output on netlify / ci
  if (process.env.COMMIT_REF || process.env.CI) {
    args += ` --verbose`;
  }

  if (pkg === `cover`) {
    cwd += `/packages/cover`;
    cmd = `yarn compile${args}`;
  }

  execSync(cmd, opts);
}
