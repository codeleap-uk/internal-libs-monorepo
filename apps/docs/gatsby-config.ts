import type { GatsbyConfig } from 'gatsby'

process.env.SITE_URL = process.env.SITE_URL || 'http://localhost:8000/'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Codeleap Docs`,
    titleTemplate: 'CodeLeap | %s',
    description: 'The codeleap documentation',
    url: process.env.SITE_URL,
    siteUrl: process.env.SITE_URL,
    image: '/images/codeleap-share.png',
  },
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-tsconfig-paths`,
    'gatsby-plugin-emotion',
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        'icon': 'src/images/favicon.png',
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        mdxOptions: {
          remarkPlugins: [{
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },],
          rehypePlugins: [],
        },
        extensions: ['.mdx', '.md'],
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        'path': `${__dirname}/src/images/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        'name': 'pages',
        'path': './src/pages/',
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'articles',
        path: `${__dirname}/src/articles`,
        ignore: ['**/*.{tsx, png, jsx, js, jpg, webp, json}'],
      },
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`,
        ignore: [`**/*.ts`, `**/_*`],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts-v2`,
      options: {
        fonts: [
          {
            family: 'Roboto',
            weights: ['100', '200', '300', '400', '500', '600', '700', '800'],
          },
          {
            family: 'Roboto',
            weights: ['100', '200', '300', '400', '500', '600', '700', '800'],
          },
        ],
        display: `swap`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /.\/src\/app\/assets\/icons\/.*svg/
        }
      }
    }
  ],
}

export default config
