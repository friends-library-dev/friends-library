// @flow
import chalk from 'chalk';
import rightPad from 'right-pad';
import { find, max } from 'lodash';
import inquirer from 'inquirer';
import { grey } from '@friends-library/cli/color';
import { mutateLine } from './mutate';
import type { MutationResolver, Line, MatchLocation, LineContext, LineMutation } from './type';

function clear() {
  process.stdout.write('\x1B[2J\x1B[0f');
}

const prompt: MutationResolver = (
  line: Line,
  locs: Array<MatchLocation>,
  context: LineContext,
): Promise<Array<LineMutation>> => {
  const promise = Promise.all(locs.map(loc => getMutation(line, loc, context)));
  return promise;
};

export default prompt;


export function choiceData(loc: MatchLocation, line: Line): Array<Object> {
  const defaults = {
    proposed: '',
    isKeep: false,
    isRemove: false,
    isCustom: false,
  };

  const data = loc.replace.map(replace => ({
    ...defaults,
    value: replace,
    display: `"${replace}"`,
    isKeep: replace === loc.match,
    isRemove: replace === '',
  }));

  if (!find(data, { isKeep: true })) {
    data.push({
      ...defaults,
      value: loc.match,
      display: `"${loc.match}"`,
      isKeep: true,
    });
  }

  if (!find(data, { isRemove: true })) {
    data.push({
      ...defaults,
      value: '',
      display: ` ${toChar(loc.match, '_')} `,
      isRemove: true,
    });
  }

  if (!find(data, { isCustom: true })) {
    data.push({
      ...defaults,
      value: '<<custom>>',
      display: ` ${toChar(loc.match, '?')} `,
      isCustom: true,
    });
  }

  return data.map(d => {
    const proposedMutation = {
      start: loc.start,
      end: loc.end,
      replace: '',
    };

    if (d.isKeep) {
      proposedMutation.replace = chalk.green(d.value);
    } else if (d.isRemove) {
      proposedMutation.replace = '';
    } else if (d.isCustom) {
      proposedMutation.replace = chalk.magenta('???');
    } else {
      proposedMutation.replace = chalk.green(d.value);
    }

    // this wrap/filter stuff is stupid and should be
    // ripped out. i don't need to re-use mutate line
    // here, I'm pretty sure what i want for my proposed
    // could be famred out to a new function that was still DRY
    d.proposed = mutateLine(line, [proposedMutation], {
      wrapBefore: chalk.gray,
      wrapAfter: chalk.gray,
      filterBefore: b => b.split(' ').slice(-3).join(' '),
      filterAfter: a => a.split(' ').slice(0, 3).join(' '),
    });

    return d;
  });
}

function toChar(str: string, char: string): string {
  return str.split('').map(() => char).join('');
}

function toInquirerChoice(
  { display, value, isKeep, isRemove, isCustom, proposed }: Object,
  index: number,
  choices: Array<Object>,
): {| name: string, value: string |} {
  const maxDisplay = max(choices.map(c => c.display)).length;
  let name = `   ${rightPad(display, maxDisplay, ' ')} `;
  if (isKeep) {
    name += chalk.green('{+KEEP+}  ');
  } else if (isRemove) {
    name += chalk.red('[-REMOVE-]');
  } else if (isCustom) {
    name += chalk.magenta('[~CUSTOM~]');
  } else {
    name += '          ';
  }
  name += `  >>>>> ${proposed} <<<<<`;
  return { name, value };
}

function getChoices(loc: MatchLocation, line: Line): Array<Object> {
  const choices = choiceData(loc, line);
  return choices.map(toInquirerChoice);
}

function getMutation(line, loc, context): Promise<LineMutation> {
  const mutation = {
    start: loc.start,
    end: loc.end,
    replace: '',
  };

  if (loc.prompt === false) {
    mutation.replace = loc.replace[0]; // eslint-disable-line prefer-destructuring
    return Promise.resolve(mutation);
  }

  clear();
  printInContext(line, loc, context);
  return inquirer
    .prompt([{
      type: 'list',
      name: 'replace',
      message: 'Replace with:',
      choices: getChoices(loc, line),
    }])
    .then(({ replace }) => {
      if (replace === '<<custom>>') {
        return inquirer.prompt([{
          type: 'input',
          name: 'custom',
        }]).then(({ custom }) => {
          clear();
          mutation.replace = custom;
          return mutation;
        });
      }
      clear();
      mutation.replace = replace;
      return mutation;
    });
}

function printInContext(line: Line, loc: MatchLocation, { index, lines }: LineContext): void {
  printLinesBefore(index, lines);
  printHighlightedLocation(line, loc);
  printLinesAfter(index, lines);
  console.log('\n');
}

function printHighlightedLocation(line: Line, loc: MatchLocation): void {
  const before = line.substr(0, loc.start);
  const after = line.substr(loc.end);
  console.log(`${before}${chalk.underline.bold.yellow(loc.match)}${after}`);
}

function printLinesBefore(index: number, lines: Array<Line>, amt: number = 2): void {
  for (let i = amt; i > 0; i--) {
    printContextLine(index - i, lines);
  }
}

function printLinesAfter(index: number, lines: Array<Line>, amt: number = 2): void {
  for (let i = 1; i <= amt; i++) {
    printContextLine(index + i, lines);
  }
}

function printContextLine(index: number, lines: Array<Line>): void {
  grey(lines[index] || '');
}
