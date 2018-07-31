// @flow
/* eslint-disable no-param-reassign, no-return-assign */
import Friend from './Friend';
import Document from './Document';
import Edition from './Edition';
import Format from './Format';
import Chapter from './Chapter';
import Audio from './Audio';
import AudioPart from './AudioPart';

export default function friendFromJS(js: Object): Friend {
  const friend = new Friend(
    js.name,
    js.slug,
    js.gender,
    js.description,
    (js.documents || []).map(document => new Document(
      document.title,
      document.original_title || '',
      document.slug,
      document.description,
      document.filename,
      document.published || null,
      document.tags,
      (document.editions || []).map(edition => new Edition(
        edition.type,
        edition.pages,
        (edition.formats || []).map(format => new Format(format.type)),
        (edition.chapters || []).map(chapter => new Chapter(chapter.title)),
        edition.description || null,
        edition.audio ? new Audio(
          edition.audio.reader,
          edition.audio.parts.map(part => new AudioPart(
            part.seconds,
            part.filesize_hq || part.filesizeHq,
            part.filesize_lq || part.filesizeLq,
            part.external_id_hq || part.externalIdHq,
            part.external_id_lq || part.externalIdLq,
            part.title || '',
            part.chapters || [],
          )),
        ) : null,
      )),
    )),
  );

  friend.documents.forEach((document) => {
    document.friend = friend;
    document.editions.forEach((edition) => {
      edition.document = document;
      edition.formats.forEach(format => format.edition = edition);
      if (edition.audio) {
        edition.audio.edition = edition;
      }
    });
  });

  return friend;
}
