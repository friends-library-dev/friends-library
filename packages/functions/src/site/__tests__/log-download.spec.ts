import logDownload from '../log-download';
import { invokeCb } from './invoke';

jest.mock(`@friends-library/slack`);

const create = jest.fn(() => Promise.resolve([null, true]));
jest.mock(`@friends-library/db`, () => ({
  Client: class {
    downloads = { create };
  },
}));

describe(`logDownload()`, () => {
  beforeEach(() => jest.clearAllMocks());

  it(`returns redirect from \`log/download\` path`, async () => {
    const event = {
      path: `/site/log/download/doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf`,
    };
    const { err, res } = await invokeCb(logDownload, event);
    expect(err).toBeNull();
    expect(res.headers!.location).toBe(
      `/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf`,
    );
  });

  test(`\`log/download\` path works prefixed with \`.netlify/functions`, async () => {
    const event = {
      path: `/.netlify/functions/site/log/download/doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf`,
    };
    const { res } = await invokeCb(logDownload, event);
    expect(res.headers!.location).toBe(
      `/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf`,
    );
  });

  const cases: [string, string, Record<string, any>][] = [
    [
      `doc-id/en/george-fox/journal/updated/mp3-zip/Journal--mp3s--lq.zip`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--mp3s--lq.zip`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3-zip`,
        audioQuality: `LQ`,
        audioPartNumber: undefined,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mp3-zip/Journal--mp3s.zip`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--mp3s.zip`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3-zip`,
        audioQuality: `HQ`,
        audioPartNumber: undefined,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mp3/Journal--pt2.mp3`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--pt2.mp3`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3`,
        audioQuality: `HQ`,
        audioPartNumber: 2,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mp3/Journal--pt2--lq.mp3`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--pt2--lq.mp3`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3`,
        audioQuality: `LQ`,
        audioPartNumber: 2,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/m4b/Journal--lq.m4b`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--lq.m4b`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `m4b`,
        audioQuality: `LQ`,
        audioPartNumber: undefined,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/m4b/Journal.m4b`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal.m4b`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `m4b`,
        audioQuality: `HQ`,
        audioPartNumber: undefined,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mp3/Journal--lq.mp3`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--lq.mp3`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3`,
        audioQuality: `LQ`,
        audioPartNumber: 1,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mp3/Journal.mp3`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal.mp3`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mp3`,
        audioQuality: `HQ`,
        audioPartNumber: 1,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/epub/Journal--updated.epub`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--updated.epub`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `epub`,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/mobi/Journal--updated.mobi`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--updated.mobi`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `mobi`,
      },
    ],
    [
      `doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf`,
      `/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf`,
      {
        documentId: `doc-id`,
        edition: `updated`,
        format: `web-pdf`,
      },
    ],
    [
      `doc-id/en/george-fox/journal/modernized/podcast/podcast.rss`,
      `/george-fox/journal/modernized/podcast.rss`,
      {
        documentId: `doc-id`,
        edition: `modernized`,
        format: `podcast`,
        audioQuality: `HQ`,
      },
    ],
    [
      `doc-id/en/george-fox/journal/modernized/podcast/podcast--lq.rss`,
      `/george-fox/journal/modernized/lq/podcast.rss`,
      {
        documentId: `doc-id`,
        edition: `modernized`,
        format: `podcast`,
        audioQuality: `LQ`,
      },
    ],
  ];

  test.each(cases)(`log path %s should redir to %s`, async (path, redir, download) => {
    const { res } = await invokeCb(logDownload, { path: `/site/log/download/${path}` });
    expect(res.headers!.location).toBe(redir);
    expect((<jest.Mock>create).mock.calls[0][0]).toMatchObject(download);
  });

  const botCases = [
    `Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)`,
  ];

  test.each(botCases)(`bot user agents should not be saved`, async userAgent => {
    const path = `/site/log/download/doc-id/en/george-fox/journal/modernized/podcast/podcast--lq.rss`;
    await invokeCb(logDownload, {
      path,
      headers: {
        'user-agent': userAgent,
      },
    });
    expect(create).not.toHaveBeenCalled();
  });
});
