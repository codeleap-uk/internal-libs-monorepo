import { View, Text } from '@/app'
import { Link } from './Link'
import { graphql, useStaticQuery } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
export default ({ children, pageContext }) => {
  const { title, date } = pageContext.frontmatter
  const { allMdx } = useStaticQuery(query)

  const pages = allMdx.edges.reduce((acc, x) => {
    const itemData = x.node.frontmatter
    const copy = { ...acc }

    if (copy[itemData.category]) {
      copy[itemData.category].push(itemData)
    } else {
      copy[itemData.category] = [itemData]
    }

    return copy
  }, {})

  return <MDXProvider components={{ h1: ({ children }) => <Text variants={['h1']} text={children}/> }}>
    <View >
      <View variants={['column']}>
        {
          Object.entries(pages).map(([category, items]) => {
            return <View variants={['column']}>
              <Text variants={['h2']} text={category} />
              {items.map(p => <Link text={p.title} to={`/docs/${p.path}`} />)}

            </View>
          })
        }
      </View>
      <View variants={['column']}>
        <Text >{title}</Text>
        {children}
      </View>
    </View>
  </MDXProvider>
}

const query = graphql`
  query {
    allMdx(filter: {}) {
      edges {
        node {
          frontmatter {
            date
            path
            title
            category
          }
        }
      }
    }
}
`
