const chalk = require('chalk');
const { getAllFriends, getFriend } = require('./friends/es5');

const LANG = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  console.log('\n🚀  Creating nodes from Friends .yml files');

  getAllFriends(LANG).forEach(friend => {
    const color = friend.isMale() ? 'cyan' : 'magenta';
    const msg = chalk[color].dim(`Create friend node: ${friend.slug}`);
    console.log(`${friend.isMale() ? '👴' : '👵'}  ${msg}`);
    createNode({
      id: createNodeId(friend.slug),
      parent: null,
      children: [],
      internal: {
        type: 'Friend',
        content: JSON.stringify(friend),
        contentDigest: createContentDigest(friend),
      },
      ...friendNodeProps(friend),
    });

    friend.documents.forEach(document => {
      console.log(chalk.gray(`  ↳ 📙  Create document node: ${friend.slug}/${document.slug}`));
      const docProps = documentNodeProps(document, friend);
      createNode({
        id: createNodeId(`${friend.slug}/${document.slug}`),
        parent: null,
        children: [],
        internal: {
          type: 'Document',
          content: JSON.stringify(docProps),
          contentDigest: createContentDigest(docProps),
        },
        friendSlug: friend.slug,
        ...docProps,
      })
    })
  });

  console.log('\n');
}


function friendNodeProps(friend) {
  return {
    name: friend.name,
    slug: friend.slug,
    gender: friend.gender,
    description: friend.description,
    url: friend.url(),
    documents: friend.documents.map(doc => documentNodeProps(doc, friend)),
  }
}

function documentNodeProps(doc, friend) {
  doc.friend = friend;
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
    editions: doc.editions.map(edition => {
      edition.document = doc;
      return {
        type: edition.type,
        description: edition.description || '',
        formats: edition.formats.map(format => {
          format.edition = edition;
          return {
            type: format.type,
            url: format.url()
          }
        }),
        ...edition.audio ? {
          audio: {
            reader: edition.audio.reader,
            parts: edition.audio.parts.map(part => ({
              title: part.title,
              externalIdHq: part.externalIdHq,
            }))
          }
        } : {}
      };
    }),
  };
}
