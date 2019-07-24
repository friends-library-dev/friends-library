const { execSync } = require('child_process');

const [, , pkg, ...rest] = process.argv;

const pkgs = [
  'bot',
  'asciidoc',
  'cli',
  'client',
  'evans',
  'friends',
  'jones',
  'hilkiah',
  'types',
  'cover',
  'styleguide',
  'fell',
  'ui',
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
  let args = rest.length ? ` ${rest.join(' ')}` : '';
  let cwd = process.cwd();
  let cmd = `yarn tsc --build packages/${pkg}${args}`;

  // always use verbose output on netlify / ci
  if (process.env.COMMIT_REF || process.env.CI) {
    args += ' --verbose';
  }

  if (pkg === 'cover') {
    cwd += '/packages/cover';
    cmd = `yarn compile${args}`;
  }

  execSync(cmd, { cwd, stdio: 'inherit' });
}
