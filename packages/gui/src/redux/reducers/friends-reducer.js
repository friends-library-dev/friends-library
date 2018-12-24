// @flow
import { createReducer } from 'redux-starter-kit'
import { get } from 'lodash';

export default createReducer({}, {
  RECEIVE_FRIEND: (state, action) => {
    const { payload: { friend, lang } } = action;
    state[`${lang}/${friend.slug}`] = {
      name: friend.name,
      slug: friend.slug,
      gender: friend.gender,
      documents: friend.documents.reduce((docs, doc) => {
        docs[doc.slug] = {
          title: doc.title,
          slug: doc.slug,
          editions: doc.editions.reduce((eds, ed) => {
            eds[ed.type] = {
              type: ed.type,
              files: {},
            }
            return eds;
          }, {})
        }
        return docs;
      }, {}),
      filesReceived: false,
    };
  },
  RECEIVE_REPO_FILES: (state, action) => {
    const { payload: { friendSlug, files } } = action;
    const friend = state[`en/${friendSlug}`];
    friend.filesReceived = true;
    files.forEach(({ fullPath, relPath }) => {
      const [docSlug, editionSlug, filename] = relPath.split('/');
      if (get(friend.documents, [docSlug, 'editions', editionSlug])) {
        friend.documents[docSlug].editions[editionSlug].files[filename] = {
          filename,
          path: fullPath,
          content: null,
        };
      }
    });
  },
  RECEIVE_FILE_CONTENT: (state, action) => {
    console.log('RECEIVE_FILE_CONTENT reducer!');
    const { payload: {
      lang,
      friendSlug,
      documentSlug,
      editionType,
      filename,
      content,
    } } = action;
    const document = state[`${lang}/${friendSlug}`].documents[documentSlug];
    const file = document.editions[editionType].files[filename];
    file.content = content;
    console.log(file, content);
  }
});
