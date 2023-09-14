const path = require('path');
const slugify = require('slugify');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);

  result.data.allMdx.edges.forEach(({ node }) => {
    const title = node.frontmatter.title;
    const slug = slugify(title, { lower: true }); // Crie um slug a partir do título

    createPage({
      path: slug, // Use o slug como o caminho da página
      component: path.resolve('./src/components/Article/Layout.tsx'),
      context: {
        id: node.frontmatter.title,
      },
    });
  });
};
