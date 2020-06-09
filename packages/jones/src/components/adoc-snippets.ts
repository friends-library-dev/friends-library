/* eslint-disable no-template-curly-in-string */
import 'brace/ext/language_tools';

// @ts-ignore
const { snippetManager } = window.ace.acequire(`ace/snippets`);

snippetManager.register(
  [
    {
      content: `[.signed-section-closing]`,
      name: `[.signed-section-closing]`,
      tabTrigger: `sscl`,
    },
    {
      name: `[.signed-section-signature]`,
      tabTrigger: `sss`,
      content: `[.signed-section-signature]`,
    },
    {
      name: `[.signed-section-context-open]`,
      tabTrigger: `ssco`,
      content: `[.signed-section-context-open]`,
    },
    {
      name: `[.signed-section-context-close]`,
      tabTrigger: `sscc`,
      content: `[.signed-section-context-close]`,
    },
    {
      name: `[.salutation]`,
      tabTrigger: `sal`,
      content: `[.salutation]`,
    },
    {
      name: `[.chapter-synopsis]`,
      tabTrigger: `cs`,
      content: `[.chapter-synopsis]`,
    },
    {
      content: `[.embedded-content-document.\${1:letter}]\n--\n$2`,
      name: `[.embedded-content-document.letter]`,
      tabTrigger: `ed`,
    },
    {
      name: `[.embedded-content-document.epistle]`,
      tabTrigger: `ede`,
      content: `[.embedded-content-document.epistle]\n--\n`,
    },
    {
      name: `[quote.scripture]`,
      tabTrigger: `qs`,
      content: `[quote.scripture, , $1]\n____\n$2`,
    },
    {
      name: `[quote]`,
      tabTrigger: `q`,
      content: `[quote]\n____\n`,
    },
    {
      name: `[.asterism]`,
      tabTrigger: `ast`,
      content: `[.asterism]\n'''`,
    },
    {
      name: `[.letter-heading]`,
      tabTrigger: `lh`,
      content: `[.letter-heading]`,
    },
    {
      name: `smart apostrophe open (start)`,
      tabTrigger: `sas`,
      content: `'\``,
    },
    {
      name: `smart apostrophe close (end)`,
      tabTrigger: `sae`,
      content: `\`'`,
    },
    {
      name: `smart quote open (start)`,
      tabTrigger: `sqs`,
      content: `"\``,
    },
    {
      name: `smart quote close (end)`,
      tabTrigger: `sqe`,
      content: `\`"`,
    },
    {
      name: `[.offset]`,
      tabTrigger: `off`,
      content: `[.offset]`,
    },
    {
      name: `[.numbered]`,
      tabTrigger: `num`,
      content: `[.numbered]`,
    },
    {
      name: `[.discourse-part]`,
      tabTrigger: `dp`,
      content: `[.discourse-part]`,
    },
    {
      name: `[.small-break]`,
      tabTrigger: `sb`,
      content: `[.small-break]\n'''\n`,
    },
    {
      name: `[.alt]`,
      tabTrigger: `alt`,
      content: `[.alt]\n=== `,
    },
    {
      name: `[.old-style]`,
      tabTrigger: `os`,
      content: `[.old-style]`,
    },
    {
      name: `[.chapter-subtitle--blurb]`,
      tabTrigger: `csb`,
      content: `[.chapter-subtitle--blurb]`,
    },
    {
      name: `[.book-title]#`,
      tabTrigger: `bt`,
      content: `[.book-title]#`,
    },
  ],
  `adoc`,
);
