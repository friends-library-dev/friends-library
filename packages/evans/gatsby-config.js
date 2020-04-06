const path = require('path');
const proxy = require('http-proxy-middleware');
const { getAllFriends } = require('@friends-library/friends');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const LANG = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

module.exports = {
  siteMetadata: {
    siteUrl:
      LANG === 'en'
        ? 'https://www.friendslibrary.com'
        : 'https://bibliotecadelosamigos.org',
    title: LANG === 'en' ? 'Friends Library' : 'La Biblioteca de los Amigos',
    numSpanishBooks: getAllFriends('es', true)
      .flatMap(friend => friend.documents)
      .filter(document => document.hasNonDraftEdition).length,
    numEnglishBooks: getAllFriends('en', true)
      .flatMap(friend => friend.documents)
      .filter(document => document.hasNonDraftEdition).length,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'mdx',
        path: `${__dirname}/src/mdx`,
        ignore: [`**/*.${LANG === 'en' ? 'es' : 'en'}.mdx`],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: LANG === 'en' ? 'Friends Library' : 'Biblioteca de los Amigos',
        short_name: LANG === 'en' ? 'Friends Library' : 'Biblioteca de los Amigos',
        start_url: '/',
        background_color: '#000000',
        theme_color: LANG === 'es' ? '#c18c59' : '#6c3142',
        display: 'minimal-ui',
        icon: `src/images/favicon_${LANG}.png`,
      },
    },

    'gatsby-plugin-remove-serviceworker',
    'gatsby-plugin-typescript',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['cabin'],
        display: 'swap',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/templates/StaticPage.tsx'),
        },
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        tailwind: true,
        printRejected: true,
        purgeOnly: [path.join(__dirname, '../ui/src/Tailwind.css')],
        whitelistPatterns: [/:lang/],
        content: [
          path.join(__dirname, './src/**/!(*.d).{ts,tsx,mdx}'),
          path.join(__dirname, '../ui/src/**/!(*.d).{ts,tsx}'),
        ],
      },
    },
  ],

  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://[::1]:2345',
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      }),
    );
  },
};
