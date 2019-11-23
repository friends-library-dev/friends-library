import Friend from './Friend';
import Document from './Document';
import Edition from './Edition';
import Format from './Format';
import Chapter from './Chapter';
import Audio from './Audio';
import AudioPart from './AudioPart';

export default function friendFromJS(js: any): Friend {
  const friend = new Friend(
    js.id,
    js.lang,
    js.name,
    js.slug,
    js.gender,
    js.description,
    (js.documents || []).map(
      (document: any) =>
        new Document(
          document.id,
          document.title,
          document.original_title || '',
          document.slug,
          document.description,
          document.filename,
          document.published || undefined,
          document.tags,
          (document.editions || []).map(
            (edition: any) =>
              new Edition(
                edition.type,
                (edition.formats || []).map((format: any) => new Format(format.type)),
                (edition.chapters || []).map((chapter: any) => new Chapter(chapter)),
                edition.isbn,
                edition.description || undefined,
                edition.editor || undefined,
                edition.audio
                  ? new Audio(
                      edition.audio.reader,
                      edition.audio.parts.map(
                        (part: any) =>
                          new AudioPart(
                            part.seconds,
                            part.filesize_hq || part.filesizeHq,
                            part.filesize_lq || part.filesizeLq,
                            part.external_id_hq || part.externalIdHq,
                            part.external_id_lq || part.externalIdLq,
                            part.title || '',
                            part.chapters || [],
                          ),
                      ),
                    )
                  : undefined,
                edition.splits || undefined,
              ),
          ),
        ),
    ),
  );

  friend.documents.forEach(document => {
    document.friend = friend;
    document.editions.forEach(edition => {
      edition.document = document;
      edition.formats.forEach(format => (format.edition = edition));
      if (edition.audio) {
        edition.audio.edition = edition;
      }
    });
  });

  return friend;
}
