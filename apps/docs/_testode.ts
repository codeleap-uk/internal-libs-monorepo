// const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope')
// const path = require('path')
// const fs = require('fs')
// const { inferProperties } = require('./src/components/Article/inferProperties')
// import path from 'path'
import fs from 'fs'
// import { inferProperties } from './src/components/Article/inferProperties'
import { GatsbyNode } from "gatsby"
import { CreatePagesArgs } from "gatsby"

// /**
//  * Implement Gatsby's Node APIs in this file.
//  *
//  * See: https://www.gatsbyjs.org/docs/node-apis/
//  */

function inferProperties(absolutePath) {
  let parts = absolutePath.split('/')
  const sliceFrom = parts.lastIndexOf('articles')
  const articlesPath = parts.slice(0, sliceFrom + 1)
  parts = parts.slice(sliceFrom + 1)
  // const sliceFrom = parts.indexOf('articles')
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

// const CLIENT_ONLY_PATHS = [
//   '/components',
// ] // These pages will NOT follow standard Gatsby routing. To be used with internal router.

// export const onCreatePage = async ({ page, actions }) => {
//   const { createPage } = actions

//   // console.info({ CLIENT_ONLY_PATHS, path: page.path })
//   const clientOnly = CLIENT_ONLY_PATHS.some(p => page.path.startsWith(p))

//   // NOTE test this with INTL later, it was screwing up docs rendering
//   if (clientOnly) {
//     page.matchPath = `${page.path}*`
//     createPage(page)

//   }

// }

// export const createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions

//   const { data } = await graphql(`
//     {
//       allMdx( sort: { fields: [frontmatter___title], order: DESC }) {
//         edges {
//           node {
//             fileAbsolutePath
//             frontmatter {
//               title

//             }
//           }
//         }
//       }
//     }
//   `).catch(error => console.error(error))

//   if (data) {
//     const moduleOrders = {}
//     data.allMdx.edges.forEach(({ node }) => {
//       const pageInfo = inferProperties(node.fileAbsolutePath)
//       let order = null
//       if (!!moduleOrders[pageInfo.module]) {
//         order = moduleOrders[pageInfo.module]
//       } else if (fs.existsSync(pageInfo.orderFile)) {
//         order = fs.readFileSync(pageInfo.orderFile).toString()
//         order = JSON.parse(order)
//         moduleOrders[pageInfo.module] = order
//       }
//       const createPageArgs = {
//         path: pageInfo.path,
//         component: node.fileAbsolutePath,
//         context: {
//           pagePath: pageInfo.path,
//           module: pageInfo.module,
//           isLibrary: pageInfo.isLibrary,
//           order,
//         },
//       }

//       createPage(createPageArgs)
//       if (pageInfo.filename === 'index') {
//         const indexPath = pageInfo.path.split('/').slice(0, -1).join('/')

//         createPage({
//           ...createPageArgs,
//           path: indexPath,

//         })
//       }
//     })
//   }
// }

// export const createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions
//   const typeDefs = `
//     type MdxFrontmatter implements Node {
//       title: String
//     }
//   `
//   createTypes(typeDefs)
// }

const node: GatsbyNode = {
  onCreatePage: async ({ page, actions }) => {
    const { createPage } = actions

    const clientOnly = CLIENT_ONLY_PATHS.some(p => page.path.startsWith(p))

    if (clientOnly) {
      page.matchPath = `${page.path}*`
      createPage(page)
    }
  },
  createPages: async ({ graphql, actions }: CreatePagesArgs) => {
    const { createPage } = actions

    const result = await graphql(`
      query {
        allMdx {
          edges {
            node {
              fileAbsolutePath
              frontmatter {
                title
              }
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

      data?.allMdx?.edges?.forEach(({ node }) => {
        const pageInfo = inferProperties(node.fileAbsolutePath)
        let order = null
        if (!!moduleOrders[pageInfo.module]) {
          order = moduleOrders[pageInfo.module]
        } else if (fs.existsSync(pageInfo.orderFile)) {
          order = fs.readFileSync(pageInfo.orderFile).toString()
          order = JSON.parse(order)
          moduleOrders[pageInfo.module] = order
        }
        const createPageArgs = {
          path: pageInfo.path,
          component: node.fileAbsolutePath,
          context: {
            pagePath: pageInfo.path,
            module: pageInfo.module,
            isLibrary: pageInfo.isLibrary,
            order,
          },
        }

        createPage(createPageArgs)
        if (pageInfo.filename === 'index') {
          const indexPath = pageInfo.path.split('/').slice(0, -1).join('/')

          createPage({
            ...createPageArgs,
            path: indexPath,

          })
        }
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

  onCreateWebpackConfig: ({ actions, stage }) => {
    if (stage === 'build-html') {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /firebase/,
              use: ['null-loader'],
            },
          ],
        },
      })
    }
  }
}

export default node
