require(`@friends-library/env/load`);
const env = require(`@friends-library/env`).default;
const { getAllFriends } = require('@friends-library/friends');

exports.handler = async function (event) {
  const { CLOUD_STORAGE_BUCKET_URL: CLOUD_URL } = env.require('CLOUD_STORAGE_BUCKET_URL');
  const lang = event.queryStringParameters.lang === `es` ? `es` : `en`;
  const friends = getAllFriends(lang, true);
  const audios = [];
  friends.forEach((friend) => {
    friend.documents.forEach((doc) => {
      doc.editions.forEach((edition) => {
        if (edition.isDraft) return;
        if (!edition.audio) return;
        const { audio } = edition;
        audios.push({
          id: `${doc.id}--${edition.type}`,
          date: audio.added,
          title: doc.title,
          friend: friend.name,
          reader: audio.reader,
          artwork: `${CLOUD_URL}/${audio.imagePath}`,
          description: doc.description,
          shortDescription: doc.partialDescription,
          parts: audio.parts.map((part, idx) => ({
            title: part.title,
            duration: part.seconds,
            size: part.filesizeHq,
            sizeLq: part.filesizeLq,
            url: `${CLOUD_URL}/${audio.partFilepath(idx, `HQ`)}`,
            urlLq: `${CLOUD_URL}/${audio.partFilepath(idx, `LQ`)}`,
          })),
        });
      });
    });
  });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(audios),
  };
};
