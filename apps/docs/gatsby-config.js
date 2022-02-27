module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'Codeleap web template',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        path: `${__dirname}/src/app/intl`,
        languages: [`en`],
        defaultLanguage: `en`,
        redirect: true,
      },
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        credentials: {
          apiKey: 'AIzaSyBzvr9bN5M2lgzTLIo07wn3bUmmZnsMhaA',
          authDomain: 'codeleap-project-template.firebaseapp.com',
          databaseURL: 'https://codeleap-project-template.firebaseio.com',
          projectId: 'codeleap-project-template',
          storageBucket: 'codeleap-project-template.appspot.com',
          messagingSenderId: '268760770384',
          appId: '1:268760770384:web:49a825eb74a7b626d1ee55',
        },
      },
    },
    `gatsby-plugin-tsconfig-paths`,
    'gatsby-plugin-emotion',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/codeleap_logo_white.png',
      },
    },
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        decks: [],
        defaultLayouts: {
          default: require.resolve('./src/components/DocLayout.tsx'),
        },
        extensions: ['.mdx', '.md'],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'articles',
        path: `${__dirname}/src/articles`,
        ignore: ['**/.tsx*'],
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },

  ],
}
