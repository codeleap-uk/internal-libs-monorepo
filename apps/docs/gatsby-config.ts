import type { GatsbyConfig } from 'gatsby'

process.env.SITE_URL = process.env.SITE_URL || 'http://localhost:8000/'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Codeleap Web Template`,
    titleTemplate: 'CodeLeap | %s',
    description:
      'CodeLeap specialises in design and development of premium mobile & web apps. We are passionate about making beautiful user experiences. Based in London, UK. Get in touch!',
    url: process.env.SITE_URL,
    siteUrl: process.env.SITE_URL,
    image: '/images/codeleap-share.png', // Path to your image you placed in the 'static' folder
    twitterUsername: '@vrgimael',
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
          remarkPlugins: [],
          rehypePlugins: [],
        },
        extensions: ['.mdx', '.md'],
      },
    },
    'gatsby-transformer-remark',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        'name': 'images',
        'path': './src/images/',
      },
      __key: 'images',
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
        ignore: ['**/.tsx*', '**/*.{tsx, png, jsx, js, jpg, webp}'],
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
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/articles`,
        ignore: ['**/.tsx*', '**/*.{tsx, png, jsx, js, jpg, webp}'],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Inter: 100, 200, 300, 400, 500, 600, 700, 800`,
          `DMSans: 400, 600, 700`,
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
