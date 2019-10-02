const path = require('path');
// const proxy = require('http-proxy-middleware');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
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
      resolve: 'gatsby-plugin-emotion',
      options: {
        // Accepts all options defined by `babel-plugin-emotion` plugin.
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
  ],

  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  //   developMiddleware: app => {
  //     app.use(
  //       '/.netlify/functions/',
  //       proxy({
  //         target: 'http://[::1]:2345',
  //         pathRewrite: {
  //           '/.netlify/functions/': '',
  //         },
  //       }),
  //     );
  //   },
};
