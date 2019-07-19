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
  const args = rest.length ? ` ${rest.join(' ')}` : '';
  let cwd = process.cwd();
  let cmd = `yarn tsc --build packages/${pkg}${args}`;

  if (pkg === 'cover') {
    cwd += '/packages/cover';
    cmd = `yarn compile${args}`;
  }

  execSync(cmd, { cwd, stdio: 'inherit' });
}
