/*
 * To try in Ace editor, copy and paste into the mode creator
 * here : http://ace.c9.io/tool/mode_creator.html
 */

// @ts-ignore
const ace = (window as any).ace;

ace.define(
  `ace/mode/adoc_highlight_rules`,
  [
    `require`,
    `exports`,
    `ace/lib/oop`,
    `ace/mode/text`,
    `ace/mode/custom_highlight_rules`,
  ],
  (acequire: any, exports: any) => {
    const oop = acequire(`ace/lib/oop`);
    const { TextHighlightRules } = acequire(`ace/mode/text_highlight_rules`);
    const AdocHighlightRules = function (): void {
      // @ts-ignore
      this.$rules = {
        start: [
          {
            token: `punctuation`,
            regex: `(^=+ .+$)`,
          },
          {
            token: `meta.function-call`,
            regex: `(^\\* )`,
          },
          {
            token: `markup.bold`,
            regex: `(^--$)`,
          },
          {
            token: `comment.block.documentation`,
            regex: `(^//.+$)`,
          },
          {
            token: `meta.selector`,
            regex: `(("|')\`.+?\`("|'))`,
          },
          {
            token: `markup.inserted punctuation`,
            regex: `(\\^$)`,
          },
          {
            token: `markup.heading`,
            regex: `(^.+(?=::$))`,
            push: `main__1`,
          },
          {
            token: `markup.quote`,
            regex: `(^____$)`,
            push: `main__2`,
          },
          {
            token: `markup.italic`,
            regex: `(__*.+?__*)`,
          },
          {
            token: `meta.diff.header.from-file`,
            regex: `(^'''$)`,
          },
          {
            token: `markup.raw.inline`,
            regex: `(footnote(?=:\\[))`,
            push: `main__3`,
          },
          {
            token: `meta.require`,
            regex: `(^\\[(?=(quote|verse)))`,
            push: `main__5`,
          },
          {
            token: `meta.separator`,
            regex: `(\\+\\+\\+)`,
            push: `main__6`,
          },
          {
            token: `punctuation.definition.comment`,
            regex: `(^\\[)`,
            push: `main__7`,
          },
          {
            defaultToken: `text`,
          },
        ],
        main__1: [
          {
            token: `meta.diff.header.from-file`,
            regex: `(^(?=.{0,1})(?:|))`,
            next: `pop`,
          },
          {
            defaultToken: `markup.raw`,
          },
        ],
        main__2: [
          {
            token: `markup.quote`,
            regex: `(^____$)`,
            next: `pop`,
          },
          {
            defaultToken: `markup.quote`,
          },
        ],
        main__3: [
          {
            token: `meta.diff`,
            regex: `(([^\\+]\\]|\\]$))`,
            next: `pop`,
          },
          {
            token: `meta.separator`,
            regex: `(\\+\\+\\+)`,
            push: `main__4`,
          },
          {
            token: `meta.diff`,
            regex: `(:\\[)`,
          },
          {
            token: `comment`,
            regex: `(^{footnote-paragraph-split}$)`,
          },
          {
            token: `meta.diff.index`,
            regex: `(([^\\]\\+]+)|(\\+(?!\\+\\+)))`,
          },
          {
            defaultToken: `text`,
          },
        ],
        main__4: [
          {
            token: `meta.separator`,
            regex: `((\\+\\+\\+|$))`,
            next: `pop`,
          },
          {
            defaultToken: `keyword.other.unit`,
          },
        ],
        main__5: [
          {
            token: `meta.require`,
            regex: `(\\]$)`,
            next: `pop`,
          },
          {
            token: `invalid.illegal`,
            regex: `((quote|verse))`,
          },
          {
            token: `meta.property-name`,
            regex: `(\\.|,)`,
          },
          {
            token: `invalid`,
            regex: `([^\\],\\.]+)`,
          },
          {
            defaultToken: `text`,
          },
        ],
        main__6: [
          {
            token: `meta.separator`,
            regex: `((\\+\\+\\+|$))`,
            next: `pop`,
          },
          {
            defaultToken: `keyword.other.unit`,
          },
        ],
        main__7: [
          {
            token: `punctuation.definition.comment`,
            regex: `(\\]$)`,
            next: `pop`,
          },
          {
            token: `meta.tag string.quoted`,
            regex: `(\\.|#)`,
          },
          {
            token: `keyword.control`,
            regex: `(.)`,
          },
          {
            defaultToken: `text`,
          },
        ],
      };
      // @ts-ignore
      this.normalizeRules();
    };
    /* ------------------------ END ------------------------------ */
    oop.inherits(AdocHighlightRules, TextHighlightRules);
    exports.AdocHighlightRules = AdocHighlightRules;
  },
);

ace.define(
  `ace/mode/adoc`,
  [`require`, `exports`, `ace/lib/oop`, `ace/mode/text`, `ace/mode/adoc_highlight_rules`],
  (acequire: any, exports: any) => {
    const oop = acequire(`ace/lib/oop`);
    const TextMode = acequire(`ace/mode/text`).Mode;
    const AdocHighlightRules = acequire(`ace/mode/adoc_highlight_rules`)
      .AdocHighlightRules;

    const Mode = function (): void {
      // @ts-ignore
      this.HighlightRules = AdocHighlightRules;
    };

    oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

    (function () {
      // @ts-ignore
      this.$id = `ace/mode/adoc`;
    }.call(Mode.prototype));

    exports.Mode = Mode; // eslint-disable-line no-param-reassign
  },
);
