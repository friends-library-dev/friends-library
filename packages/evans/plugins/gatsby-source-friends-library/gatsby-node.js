/* eslint-disable no-console */
require('@babel/register')({
  only: [
    /packages\/friends/,
    /packages\/evans/,
  ],
});

const chalk = require('chalk');
const fs = require('fs-extra');
const { getAllFriends } = require('@friends-library/friends');
const { podcast } = require('../../src/lib/xml');
const { LANG } = require('../../src/env');

const allFriends = getAllFriends(LANG);

exports.onPostBuild = () => {
  eachFormat(({ format, document, edition }) => {
    if (format.type === 'audio') {
      const xml = podcast(document, edition);
      fs.outputFileSync(`./public/${document.url()}/${edition.type}/podcast.rss`, xml);
    }
  });
};

exports.onCreateDevServer = ({ app }) => {
  eachFormat(({ document, edition, format }) => {
    if (format.type === 'audio') {
      app.get(edition.audio.url(), (req, res) => {
        res.type('application/xml');
        res.send(podcast(document, edition));
      });
    }
  });
};

exports.sourceNodes = ({ actions, createContentDigest }, configOptions) => {
  const { createNode } = actions;
  delete configOptions.plugins;

  console.log('\n🚀  Creating nodes from Friends .yml files');
  console.log('-----------------------------------------');

  allFriends.forEach(friend => {
    const color = friend.isMale() ? 'cyan' : 'magenta';
    const msg = chalk[color].dim(`Create friend node: ${friend.id()}`);
    console.log(`${friend.isMale() ? '👴' : '👵'}  ${msg}`);
    const friendProps = friendNodeProps(friend);
    createNode({
      id: friend.id(),
      parent: null,
      children: [],
      internal: {
        type: 'Friend',
        content: JSON.stringify(friendProps),
        contentDigest: createContentDigest(friendProps),
      },
      ...friendProps,
    });

    friend.documents.forEach(document => {
      console.log(chalk.gray(`  ↳ 📙  Create document node: ${document.id()}`));
      const docProps = documentNodeProps(document);
      createNode({
        id: document.id(),
        parent: null,
        children: [],
        internal: {
          type: 'Document',
          content: JSON.stringify(docProps),
          contentDigest: createContentDigest(docProps),
        },
        friendSlug: friend.slug,
        ...docProps,
      });
    });
  });
  console.log('\n');
};

function friendNodeProps(friend) {
  return {
    name: friend.name,
    slug: friend.slug,
    gender: friend.gender,
    description: friend.description,
    url: friend.url(),
    documents: friend.documents.map(documentNodeProps),
  };
}

function documentNodeProps(doc) {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    filename: doc.filename,
    hasAudio: doc.hasAudio(),
    isCompilation: doc.isCompilation(),
    hasUpdatedEdition: doc.hasUpdatedEdition(),
    shortestEdition: (({ pages }) => ({ pages }))(doc.shortestEdition()),
    tags: doc.tags,
    url: doc.url(),
    editions: doc.editions.map(edition => ({
      type: edition.type,
      description: edition.description || '',
      formats: edition.formats.map(format => ({
        type: format.type,
        url: format.url(),
      })),
      ...edition.audio ? {
        audio: {
          reader: edition.audio.reader,
          parts: edition.audio.parts.map(part => ({
            title: part.title,
            externalIdHq: part.externalIdHq,
          })),
        },
      } : {},
    })),
  };
}

function eachFormat(cb) {
  allFriends.forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        edition.formats.forEach(format => {
          cb({ friend, document, edition, format });
        });
      });
    });
  });
}
