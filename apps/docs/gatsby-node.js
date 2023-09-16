const path = require('path');
const slugify = require('slugify');
const fs = require('fs');
const template = path.resolve(`./src/components/Article/Layout.jsx`)

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

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            frontmatter {
              title
              description
              source
              tag
            }
            internal {
              contentFilePath
            }
            body
            tableOfContents
          }
        }
      }
    }
  `);

  const moduleOrders = {}

  result.data.allMdx.edges.forEach(({ node }) => {
    const filepath = node.internal.contentFilePath

    const pageInfo = inferProperties(filepath)

    let order = null

    if (!!moduleOrders[pageInfo.module]) {
      order = moduleOrders[pageInfo.module]
    } else if (fs.existsSync(pageInfo.orderFile)) {
      order = fs.readFileSync(pageInfo.orderFile).toString()
      order = JSON.parse(order)
      moduleOrders[pageInfo.module] = order
    }

    createPage({
      path: pageInfo.path, // Use o slug como o caminho da página
      // component: path.resolve('./src/components/Article/Layout.tsx'),
      component: `${template}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        frontmatter: node.frontmatter,
        id: node.id,
        title: node.frontmatter.title,
        description: node.frontmatter.description,
        source: node.frontmatter.source,
        tag: node.frontmatter.tag,
        noder: node,
        pagePath: pageInfo.path,
        module: pageInfo.module,
        isLibrary: pageInfo.isLibrary,
        order,
        category: pageInfo.category,
        filename: pageInfo.filename,
        allMdx: result.data.allMdx,
        mdx: node.body,
        body: node.body,
        tableOfContents: node.tableOfContents,
        mdxFilePath: filepath,
      },
    });
  });
};
