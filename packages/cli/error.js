// @flow
const PrettyError = require('pretty-error');

export function prettifyErrors(): void {
  if (process.argv.includes('--ugly-error')) {
    return;
  }

  const cwd = process.cwd();
  const pe = new PrettyError();
  pe.skipNodeFiles();
  pe.skipPackage('lodash', 'yargs');
  pe.alias(`${cwd}/packages`, '[fl-pkg]');
  pe.appendStyle({
    'pretty-error > trace': {
      marginLeft: 2,
    },
    'pretty-error > trace > item': {
      marginBottom: 0,
    },
    'pretty-error > trace > item > footer > addr': {
      marginLeft: 3,
      bullet: '"<grey>  ↪</grey>"',
    },
  });
  pe.start();
}


export function catchify(fn: () => mixed): () => mixed {
  // eslint-disable-next-line consistent-return
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.log('');
      console.log(error);
      process.exit();
    }
  };
}
