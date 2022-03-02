import { graphql, useStaticQuery } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from '@/utils/hooks'
import { Page } from '../Page'
import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { Theme, View } from '@/app'
import { Header } from '../Header'
import { SearchBar } from './SearchBar'

export default ({ children, pageContext }) => {
  const { title } = pageContext.frontmatter
  const { allMdx } = useStaticQuery(query)

  const { pages, flatData } = useMdx(allMdx, pageContext.module)
  const isMobile = Theme.hooks.down('small')
  return <MDXProvider components={mdxTransforms}>
    <Page footer={false} header={false} center={false} title={title} variants={['row']}>
      <Header center={false}>
        {!isMobile && <SearchBar items={flatData}/>}
      </Header>
      <View variants={['row', 'flex']} responsiveVariants={{
        small: ['column'],
      }}>
        <Navbar pages={pages} title={`@codeleap/${pageContext.module}`}/>
        {isMobile && <SearchBar items={flatData}/>}
        <Article>
          {children}
        </Article>
        <SectionMap content={children}/>
      </View>
    </Page>
  </MDXProvider>
}

// {
//   Object.entries(pages).map(([category, items]) => {
//     return <View variants={['column']}>
//       <Text variants={['h2']} text={category} />
//       {items.map(p => <Link text={p.title} to={`/docs/${p.path}`} />)}

//     </View>
//   })
// }

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
            module
          }
        }
      }
    }
}
`
