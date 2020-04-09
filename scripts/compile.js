const { execSync } = require('child_process');
const os = require('os');

const [, , pkg, ...rest] = process.argv;

const pkgs = [
  'bot',
  'adoc-utils',
  'adoc-lint',
  'adoc-convert',
  'doc-manifests',
  'doc-html',
  'doc-css',
  'doc-artifacts',
  'cover-web-app',
  'document-meta',
  'cover-component',
  'dpc-fs',
  'lulu',
  'env',
  'evans',
  'cli-utils',
  'cloud',
  'slack',
  'jones',
  'friends',
  'hilkiah',
  'types',
  'styleguide',
  'ui',
  'fell',
  'all',
];

if (!pkg || pkgs.includes(pkg) === false) {
  throw new Error(`Invalid package for compilation: ${pkg}`);
}

if (pkg === 'all') {
  pkgs.filter(p => p !== 'all').forEach(compilePkg);
} else {
  compilePkg(pkg);
}

function compilePkg(pkg) {
  let cwd = process.cwd();
  const opts = { cwd, stdio: 'inherit' };

  // special case: compile and tweak the tailwind.config.ts file
  if (pkg === 'ui') {
    const path = 'packages/ui/tailwind.config';
    execSync(`yarn tsc ${path}.ts -declaration --skipLibCheck`, opts);
    // couldn't figure how to get TS to give me a plain `module.exports =`
    const extra = os.platform() === 'darwin' ? ' ""' : '';
    execSync(`sed -i${extra} -E 's/^exports.+\\{$/module.exports = {/' ${path}.js`, opts);
  }

  let args = rest.length ? ` ${rest.join(' ')}` : '';
  let cmd = `yarn tsc --build packages/${pkg}${args}`;

  // always use verbose output on netlify / ci
  if (process.env.COMMIT_REF || process.env.CI) {
    args += ' --verbose';
  }

  if (pkg === 'cover') {
    cwd += '/packages/cover';
    cmd = `yarn compile${args}`;
  }

  execSync(cmd, opts);
}
