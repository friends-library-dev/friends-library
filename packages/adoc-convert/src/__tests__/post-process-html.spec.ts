import { postProcessHtml } from '../post-process-html';

describe(`postProcessHtml()`, () => {
  it(`should add closing tag for <col>`, () => {
    const html = `
<colgroup>
<col>
<col style="width:50%">
</colgroup>
`;

    const expected = `
<colgroup>
<col></col>
<col style="width:50%"></col>
</colgroup>
`;

    const processed = postProcessHtml(html);
    expect(processed).toBe(expected);
  });
});
