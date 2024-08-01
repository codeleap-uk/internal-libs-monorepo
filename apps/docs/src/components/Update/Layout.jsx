import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { Page } from '../Page'
import { SectionMap } from '../Article/SectionMap'
import { mdxTransforms } from '../Article/mdxTransforms'
import { theme } from '@/app'
import { useMediaQuery } from '@codeleap/web'
import { Text, View, Link, Icon } from '..'
import { createStyles } from '@codeleap/styles'

function UpdatePage(props) {
  const { pageContext, children } = props

  const version = pageContext?.version?.replace('_', '.')

  const mediaQuery = theme.media.down('tabletSmall')
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  return (
    <Page
      title={version}
      style={{ tabletSmall: ['column'] }}
      center={false}
      contentStyle={styles.content}
    >
      {isMobile && <SectionMap content={pageContext?.tableOfContents?.items} />}

      <View style={['flex', 'padding:4', 'column', 'alignStart', 'justifyStart', 'gap:2']}>
        <Link to={'/updates/'} style={['noUnderline']}>
          <Icon name='chevron-left' size={24} />
        </Link>
        
        <View style={['row', 'gap:2', 'center', 'marginBottom:2']}>
          <View style={['borderRadius:rounded', 'backgroundColor:primary1', 'paddingHorizontal:2', 'paddingVertical:1']}>
            <Text style={['p1', 'color:primary3']} text={version} />
          </View>

          <Text style={['h2']} text={pageContext?.title} />
        </View>

        <MDXProvider components={mdxTransforms}>
          {children}
        </MDXProvider>
      </View>

      {!isMobile && <SectionMap content={pageContext?.tableOfContents?.items} />}
    </Page>
  )
}

const styles = createStyles((theme) => ({
  content: {
    height: '100%',
    minHeight: '90svh',
    paddingBottom: theme.spacing.value(3),

    [theme.media.down('tabletSmall')]: {
      ...theme.presets.column,
    }
  },
  icon: {
    transition: 'color 0.2s ease',
    color: theme.colors.neutral1,
    size: 24,
  },
  text: {
    color: theme.colors.neutral10,
    transition: 'color 0.2s ease',
  },
}))

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`

export default UpdatePage
