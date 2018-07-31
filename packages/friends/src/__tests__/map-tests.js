// @flow
/* eslint-disable prefer-destructuring */
import friendFromJS from '../map';
import Document from '../Document';
import Format from '../Format';
import Edition from '../Edition';
import Chapter from '../Chapter';
import Audio from '../Audio';

describe('friendFromJS()', () => {
  let js;

  beforeEach(() => {
    js = {
      name: 'Rebecca Jones',
      slug: 'rebecca-jones',
      description: 'description',
      documents: [
        {
          title: 'Diary and Letters',
          slug: 'diary-and-letters',
          filename: 'Journal_of_Rebecca_Jones',
          description: 'doc desc',
          tags: ['journal', 'letters'],
          editions: [
            {
              type: 'updated',
              description: 'edition description',
              pages: 261,
              formats: [
                { type: 'pdf' },
                { type: 'epub' },
                { type: 'mobi' },
              ],
              chapters: [
                { title: 'Chapter 1' },
                { title: 'Chapter 2' },
              ],
              audio: {
                reader: 'Harriet Henderson',
                parts: [
                  {
                    title: 'Part 1',
                    external_id_hq: 123,
                    external_id_lq: 234,
                    filesize_hq: 3345,
                    filesize_lq: 2234,
                    seconds: 33,
                    chapters: [0, 1, 2],
                  },
                ],
              },
            },
          ],
        },
      ],
    };
  });

  it('should set parent/child refs', () => {
    const friend = friendFromJS(js);
    const document = friend.documents[0];
    const edition = document.editions[0];
    const format = edition.formats[0];

    expect(document.friend).toBe(friend);
    expect(edition.document).toBe(document);
    expect(format.edition).toBe(edition);
    expect(edition.audio.edition).toBe(edition);
  });

  it('should map the basic props', () => {
    const friend = friendFromJS(js);

    expect(friend.name).toBe('Rebecca Jones');
    expect(friend.slug).toBe('rebecca-jones');
    expect(friend.description).toBe('description');
  });

  it('maps documents', () => {
    const friend = friendFromJS(js);

    expect(friend.documents.length).toBe(1);
    expect(friend.documents[0]).toBeInstanceOf(Document);
    expect(friend.documents[0].tags).toEqual(['journal', 'letters']);
    expect(friend.documents[0].filename).toBe('Journal_of_Rebecca_Jones');
  });

  it('maps document editions', () => {
    const edition = friendFromJS(js).documents[0].editions[0];

    expect(edition).toBeInstanceOf(Edition);
    expect(edition.pages).toBe(261);
    expect(edition.type).toBe('updated');
    expect(edition.description).toBe('edition description');
  });

  it('maps document edition formats', () => {
    const formats = friendFromJS(js).documents[0].editions[0].formats;

    expect(formats[0]).toBeInstanceOf(Format);
    expect(formats[0].type).toBe('pdf');
    expect(formats[1].type).toBe('epub');
    expect(formats[2].type).toBe('mobi');
  });

  it('maps document edition chapters', () => {
    const chapters = friendFromJS(js).documents[0].editions[0].chapters;

    expect(chapters[0]).toBeInstanceOf(Chapter);
    expect(chapters[0].title).toBe('Chapter 1');
    expect(chapters[1].title).toBe('Chapter 2');
  });

  it('maps document edition audio', () => {
    const audio = friendFromJS(js).documents[0].editions[0].audio;

    expect(audio).toBeInstanceOf(Audio);
    expect(audio.reader).toBe('Harriet Henderson');
  });

  it('maps the document edition audio parts', () => {
    const part = friendFromJS(js).documents[0].editions[0].audio.parts[0];

    expect(part.title).toBe('Part 1');
    expect(part.seconds).toBe(33);
    expect(part.externalIdHq).toBe(123);
    expect(part.externalIdLq).toBe(234);
    expect(part.filesizeHq).toBe(3345);
    expect(part.filesizeLq).toBe(2234);
    expect(part.chapters).toEqual([0, 1, 2]);
  });

  it('sets optional original title on document', () => {
    js.documents[0].original_title = 'Memorials of Rebecca Jones';

    const document = friendFromJS(js).documents[0];

    expect(document.originalTitle).toBe('Memorials of Rebecca Jones');
  });

  it('sets optional published attribute', () => {
    js.documents[0].published = 1819;

    const document = friendFromJS(js).documents[0];

    expect(document.published).toBe(1819);
  });
});
