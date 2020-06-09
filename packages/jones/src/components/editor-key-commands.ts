import { Props } from './Editor';
import { italicize } from '../lib/format';

export function addKeyCommands(editor: any, editorProps: Props): void {
  const {
    githubUser,
    increaseFontSize,
    decreaseFontSize,
    toggleSidebarOpen,
    undo,
    redo,
    find,
  } = editorProps;

  const isJared = githubUser === `jaredh159`;

  if (!isJared) {
    editor.commands.addCommand({
      name: `italicize`,
      bindKey: { mac: `Command-I`, win: `Ctrl-I` },
      exec: () => {
        const selected = editor.getSelectedText();
        const range = editor.getSelectionRange();
        const firstLine = editor.session.getLine(range.start.row);
        const lastLine = editor.session.getLine(range.end.row);
        const replacement = italicize(selected, firstLine, lastLine, range);
        editor.session.replace(range, replacement);
      },
    });
  }

  editor.commands.addCommand({
    name: `increaseFontSize`,
    bindKey: { mac: `Command-Up`, win: `Ctrl-Up` },
    exec: () => increaseFontSize(),
  });

  editor.commands.addCommand({
    name: `decreaseFontSize`,
    bindKey: { mac: `Command-Down`, win: `Ctrl-Down` },
    exec: () => decreaseFontSize(),
  });

  editor.commands.addCommand({
    name: `toggleSidebarOpen`,
    bindKey: { mac: `Command-Ctrl-7`, win: `Alt-Ctrl-7` },
    exec: () => toggleSidebarOpen(),
  });

  editor.commands.addCommand({
    name: `find`,
    bindKey: { mac: `Command-F`, win: `Ctrl-F` },
    exec: () => find(),
  });

  editor.commands.addCommand({
    name: `undo`,
    bindKey: { mac: `Command-Z`, win: `Ctrl-Z` },
    exec: () => undo(),
  });

  editor.commands.addCommand({
    name: `redo`,
    bindKey: { mac: `Command-Shift-Z`, win: `Alt-Shift-Z` },
    exec: () => redo(),
  });

  editor.commands.addCommand({
    name: `redo`,
    bindKey: { mac: `Command-S`, win: `Ctrl-S` },
    exec: () => {},
  });

  editor.commands.addCommand({
    name: `moveRight`,
    bindKey: { mac: `Command-l`, win: `Ctrl-l` },
    exec: () => {
      editor.navigateRight(1);
      return true;
    },
  });

  editor.commands.addCommand({
    name: `moveLeft`,
    bindKey: { mac: `Command-J`, win: `Ctrl-J` },
    exec: () => editor.navigateLeft(1),
  });

  editor.commands.addCommand({
    name: `moveWordRight`,
    bindKey: { mac: `Command-Alt-l` },
    exec: () => editor.navigateWordRight(),
  });

  editor.commands.addCommand({
    name: `moveWordLeft`,
    bindKey: { mac: `Command-Alt-J` },
    exec: () => editor.navigateWordLeft(),
  });

  editor.commands.addCommand({
    name: `endOfLine`,
    bindKey: { mac: `Command-Ctrl-l` },
    exec: () => editor.navigateLineEnd(),
  });

  editor.commands.addCommand({
    name: `startOfLine`,
    bindKey: { mac: `Command-Ctrl-J` },
    exec: () => editor.navigateLineStart(),
  });

  if (isJared) {
    // non-jared gets "italicize"
    editor.commands.addCommand({
      name: `moveUp`,
      bindKey: { mac: `Command-I`, win: `Ctrl-I` },
      exec: () => editor.navigateUp(1),
    });
  }

  editor.commands.addCommand({
    name: `moveDown`,
    bindKey: { mac: `Command-K`, win: `Ctrl-K` },
    exec: () => editor.navigateDown(1),
  });

  editor.commands.addCommand({
    name: `moveUp10`,
    bindKey: { mac: `Command-Ctrl-I` },
    exec: () => editor.navigateUp(10),
  });

  editor.commands.addCommand({
    name: `moveDown10`,
    bindKey: { mac: `Command-Ctrl-K` },
    exec: () => editor.navigateDown(10),
  });
}
