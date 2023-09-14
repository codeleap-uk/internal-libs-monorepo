import fs from 'fs'
import path from 'path'
import { GatsbyNode, Node } from "gatsby"
import { CreatePagesArgs } from "gatsby"

function inferProperties(absolutePath: Node['internal']['contentFilePath']) {
  let parts = absolutePath.split('/')
  const sliceFrom = parts.lastIndexOf('articles')
  const articlesPath = parts.slice(0, sliceFrom + 1)
  parts = parts.slice(sliceFrom + 1)
  const [pageModule, categoryOrFileName, ...others] = parts
  let pagePath = `${pageModule}/${categoryOrFileName.toLowerCase()}`

  if (others.length) {
    pagePath += `/${others[0]}`
  }
  pagePath = pagePath.split('.').slice(0, -1).join('')
  const filename = pagePath.split('/').pop()
  return {
    path: pagePath,
    module: pageModule,
    category: others.length ? categoryOrFileName : 'root',
    isLibrary: !['concepts'].includes(pageModule),
    orderFile: [...articlesPath, pageModule, 'order.json'].join('/'),
    filename,
  }
}

const CLIENT_ONLY_PATHS = [
  '/components',
] // These pages will NOT follow standard Gatsby routing. To be used with internal router.

const node: GatsbyNode = {
  onCreateNode: ({ node, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `Mdx`) {
      createNodeField({
        node,
        name: 'title',
        value: node.internal.content
      })
    }
  },

  // onCreatePage: async ({ page, actions }) => {
  //   const { createPage } = actions

  //   const clientOnly = CLIENT_ONLY_PATHS.some(p => page.path.startsWith(p))

  //   if (clientOnly) {
  //     page.matchPath = `${page.path}*`
  //     createPage(page)
  //   }
  // },

  createPages: async ({ graphql, actions }: CreatePagesArgs) => {
    const { createPage } = actions

    const docTemplate = path.resolve(`./src/components/Article/Layout.tsx`)

    const result = await graphql(`
      {
        allMdx {
          nodes {
            id
            frontmatter {
              title
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    `)

    if (result?.errors) {
      console.log(result?.errors)
      throw result?.errors
    }

    if (result?.data) {
      const data = result.data

      const moduleOrders = {}

      // @ts-ignore
      data?.allMdx?.edges?.forEach((edge) => {
        const node: Node = edge?.node

        // const pageInfo = inferProperties(node.internal.contentFilePath)
        // let order = null
        // if (!!moduleOrders[pageInfo.module]) {
        //   order = moduleOrders[pageInfo.module]
        // } else if (fs.existsSync(pageInfo.orderFile)) {
        //   order = fs.readFileSync(pageInfo.orderFile).toString()
        //   order = JSON.parse(order)
        //   moduleOrders[pageInfo.module] = order
        // }
        // console.log('HEREEE', node.internal.contentFilePath)

        const createPageArgs = {
          path: path.resolve('./src/articles/web/components/button.mdx'),
          component: `${docTemplate}?__contentFilePath=${path.resolve('./src/articles/web/components/button.mdx')}`,
          context: {
            title: edge.node.title,
          }
          // context: {
          //   pagePath: pageInfo.path,
          //   module: pageInfo.module,
          //   isLibrary: pageInfo.isLibrary,
          //   order,
          //   id: node?.id
          // },
        }

        createPage(createPageArgs)

        // if (pageInfo.filename === 'index') {
        //   const indexPath = pageInfo.path.split('/').slice(0, -1).join('/')

        //   createPage({
        //     ...createPageArgs,
        //     path: indexPath,

        //   })
        // }
      })
    }
  },

  createSchemaCustomization: ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type MdxFrontmatter implements Node {
          title: String
        }
      `
    createTypes(typeDefs)
  },

  // onCreateWebpackConfig: ({ actions, stage }) => {
  //   if (stage === 'build-html') {
  //     actions.setWebpackConfig({
  //       module: {
  //         rules: [
  //           {
  //             test: /firebase/,
  //             use: ['null-loader'],
  //           },
  //         ],
  //       },
  //     })
  //   }
  // }
}

export default node
