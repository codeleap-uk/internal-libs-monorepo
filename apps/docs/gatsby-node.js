/* eslint-disable @typescript-eslint/no-var-requires */
const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope')
const path = require('path')
const fs = require('fs')
const { inferProperties } = require('./src/components/Article/inferProperties')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const CLIENT_ONLY_PATHS = [
  'components',
] // These pages will NOT follow standard Gatsby routing. To be used with internal router.

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // console.info({ CLIENT_ONLY_PATHS, path: page.path })

  for (const c in CLIENT_ONLY_PATHS) {
    const str = CLIENT_ONLY_PATHS[c]
    const matchPlainRegex = new RegExp(`^\/${str}`)
    const matchLocaleRegex = new RegExp(`^\/\\w+\/${str}`)
    if (page.path.match(matchPlainRegex) || page.path.match(matchLocaleRegex)) {
      page.matchPath = `${page.path}*`
      createPage(page)
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    {
      allMdx( sort: { fields: [frontmatter___title], order: DESC }) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              path
              title
              module

            }
          }
        }
      }
    }
  `).catch(error => console.error(error))
  if (data) {
    const moduleOrders = {}
    data.allMdx.edges.forEach(({ node }) => {
      const pageInfo = inferProperties(node.fileAbsolutePath)
      let order = null
      if (!!moduleOrders[pageInfo.module]) {
        order = moduleOrders[pageInfo.module]
      } else if (fs.existsSync(pageInfo.orderFile)) {
        order = fs.readFileSync(pageInfo.orderFile).toString()
        order = JSON.parse(order)
        moduleOrders[pageInfo.module] = order
      }

      createPage({
        path: pageInfo.path,
        component: node.fileAbsolutePath,
        context: {
          pagePath: pageInfo.path,
          module: pageInfo.module,
          isLibrary: pageInfo.isLibrary,
          order,
        },
      })
    })

  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MdxFrontmatter implements Node {
      date: String
      path: String
      title: String
      category: String
      module: String
      next: String
      previous: String
      index: Int
    }
  `
  createTypes(typeDefs)
}
