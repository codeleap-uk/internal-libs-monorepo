/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const CLIENT_ONLY_PATHS = [

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
  
