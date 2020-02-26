const path = require('path');
const proxy = require('http-proxy-middleware');
const { getAllFriends } = require('@friends-library/friends');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const LANG = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

module.exports = {
  siteMetadata: {
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
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
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
