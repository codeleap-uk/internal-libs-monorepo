const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope')
const { resolve } = require('path')
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
      allMdx(limit: 5, sort: { fields: [frontmatter___title], order: DESC }) {
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
    data.allMdx.edges.forEach(({ node }) => {
      createPage({
        path: `/${node.frontmatter.module}/${node.frontmatter.path}`,
        component: node.fileAbsolutePath,
        context: {
          pagePath: node.frontmatter.path,
          module: node.frontmatter.module,
        },
      })
    })

  }
}
