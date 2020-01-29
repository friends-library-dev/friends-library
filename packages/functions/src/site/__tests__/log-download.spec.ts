import logDownload from '../log-download';
import { invokeCb } from './invoke';
import { create } from '../../lib/Download';

jest.mock('@friends-library/slack');
jest.mock('../../lib/Download', () => ({
  __esModule: true,
  default: jest.fn(),
  create: jest.fn(),
  format: ['web-pdf', 'mobi', 'epub', 'mp3-zip', 'm4b', 'mp3', 'podcast'],
}));

describe('logDownload()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns redirect from `log/download` path', async () => {
    const event = {
      path:
        '/site/log/download/doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf',
    };
    const { err, res } = await invokeCb(logDownload, event);
    expect(err).toBeNull();
    expect(res.headers!.location).toBe(
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
    );
  });

  test('`log/download` path works prefixed with `.netlify/functions', async () => {
    const event = {
      path:
        '/.netlify/functions/site/log/download/doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf',
    };
    const { res } = await invokeCb(logDownload, event);
    expect(res.headers!.location).toBe(
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
    );
  });

  const cases: [string, string, Record<string, any>][] = [
    [
      'doc-id/en/george-fox/journal/updated/mp3-zip/Journal--mp3s--lq.zip',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--mp3s--lq.zip',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3-zip',
        audio_quality: 'LQ',
        audio_part_number: undefined,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mp3-zip/Journal--mp3s.zip',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--mp3s.zip',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3-zip',
        audio_quality: 'HQ',
        audio_part_number: undefined,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mp3/Journal--pt2.mp3',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--pt2.mp3',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3',
        audio_quality: 'HQ',
        audio_part_number: 2,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mp3/Journal--pt2--lq.mp3',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--pt2--lq.mp3',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3',
        audio_quality: 'LQ',
        audio_part_number: 2,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/m4b/Journal--lq.m4b',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--lq.m4b',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'm4b',
        audio_quality: 'LQ',
        audio_part_number: undefined,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/m4b/Journal.m4b',
      '/cloud/bucket/en/george-fox/journal/updated/Journal.m4b',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'm4b',
        audio_quality: 'HQ',
        audio_part_number: undefined,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mp3/Journal--lq.mp3',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--lq.mp3',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3',
        audio_quality: 'LQ',
        audio_part_number: 1,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mp3/Journal.mp3',
      '/cloud/bucket/en/george-fox/journal/updated/Journal.mp3',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mp3',
        audio_quality: 'HQ',
        audio_part_number: 1,
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/epub/Journal--updated.epub',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.epub',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'epub',
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/mobi/Journal--updated.mobi',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.mobi',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'mobi',
      },
    ],
    [
      'doc-id/en/george-fox/journal/updated/web-pdf/Journal--updated.pdf',
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
      {
        document_id: 'doc-id',
        edition: 'updated',
        format: 'web-pdf',
      },
    ],
    [
      'doc-id/en/george-fox/journal/modernized/podcast/podcast.rss',
      '/george-fox/journal/modernized/podcast.rss',
      {
        document_id: 'doc-id',
        edition: 'modernized',
        format: 'podcast',
        audio_quality: 'HQ',
      },
    ],
    [
      'doc-id/en/george-fox/journal/modernized/podcast/podcast--lq.rss',
      '/george-fox/journal/modernized/lq/podcast.rss',
      {
        document_id: 'doc-id',
        edition: 'modernized',
        format: 'podcast',
        audio_quality: 'LQ',
      },
    ],
  ];

  test.each(cases)(`log path %s should redir to %s`, async (path, redir, download) => {
    const { res } = await invokeCb(logDownload, { path: `/site/log/download/${path}` });
    expect(res.headers!.location).toBe(redir);
    expect((<jest.Mock>create).mock.calls[0][0]).toMatchObject(download);
  });
});
