// @flow
import { noopObject } from '../../lib/utils';

let quoteDelimiters = new Set();
let footnoteStarts = new Set();
let lineEndCloseBrackets = new Set();

export function modifyEditor(cm: *) {
  cm.on('refresh', () => {
    quoteDelimiters = new Set();
    footnoteStarts = new Set();
    lineEndCloseBrackets = new Set();
  });

  cm.on('renderLine', (cm, line, el) => {
    const { line: lineNumber } = cm.lineInfo(line);

    const v2 = el.querySelector('.cm-variable-2');
    if (v2) {
      if (v2.innerHTML !== '____' && v2.innerHTML !== 'footnote:') {
        v2.classList.remove('cm-variable-2');
        if (v2.nextSibling) {
          v2.nextSibling.classList.remove('cm-keyword');
        }
      }
    }

    if (line.text === '____') {
      quoteDelimiters.add(lineNumber)
      replace('.cm-variable-2', 'adoc--purple', el);
    } else {
      quoteDelimiters.delete(lineNumber);
    }

    if (inQuote(lineNumber)) {
      el.firstChild.classList.add('adoc--purple');
    }

    if (line.text.indexOf('* ') === 0) {
      replace('.cm-keyword', 'adoc--red', el);
    }

    let isSingleLineFootnote = false;
    if (line.text.indexOf('footnote:') !== -1) {
      if (line.text.match(/footnote:\[.+\]/)) {
        isSingleLineFootnote = true;
      } else {
        el.firstChild.classList.add('adoc--green');
        footnoteStarts.add(lineNumber);
      }
    }

    if (inFootnote(lineNumber)) {
      el.firstChild.classList.add('adoc--green');
    }

    if (line.text[0] !== ']' && line.text[line.text.length - 1] === ']') {
      if (!lineEndCloseBrackets.has(lineNumber)) {
        lineEndCloseBrackets.add(lineNumber);
        // cm.refresh();
      }
    } else {
      if (lineEndCloseBrackets.has(lineNumber)) {
        lineEndCloseBrackets.delete(lineNumber);
        // cm.refresh();
      }
    }
  });


  cm.refresh();
}

function inQuote(lineNumber: number): boolean {
  if (quoteDelimiters.has(lineNumber)) {
    return false;
  }
  const ordered = [...quoteDelimiters].sort();
  return ordered.filter(ln => ln < lineNumber).length % 2 === 1;
}

function inFootnote(lineNumber: number): boolean {
  if (footnoteStarts.has(lineNumber)) {
    return false;
  }
  const ordered = [...footnoteStarts, ...lineEndCloseBrackets].sort();
  return ordered.filter(ln => ln < lineNumber).length % 2 === 1;
}

// function ixnFootnote(lineNumber: number) {
//   if (footnoteStarts.has(lineNumber)) {
//     return false;
//   }
//   const orderedNotes = [...footnoteStarts].sort();
//   if (orderedNotes.filter(ln => ln < lineNumber).length % 2 === 0) {
//     return false;
//   }
//
//   const orderedBrackets = [...closeBrackets].sort();
//   console.log({orderedNotes, orderedBrackets})
//   if (closeBrackets.has(lineNumber)) {
//     return false;
//   }
//   if (orderedBrackets.length === 0) {
//     console.log('here1');
//     return true;
//   }
//   if (orderedBrackets.filter(ln => ln < lineNumber).length % 1 === 1) {
//     console.log('here');
//     return true;
//   }
//
//   return false;
// }

function replace(selector, newClass, el) {
  query(el, selector).classList = newClass;
}

function query(el, selector) {
  return el.querySelector(selector) || noopObject;
}
