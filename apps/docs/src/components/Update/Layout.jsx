import { graphql, navigate } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { Page } from '../Page'
import { SectionMap } from '../Article/SectionMap'
import { mdxTransforms } from '../Article/mdxTransforms'
import { Theme, variantProvider } from '@/app'
import { useMediaQuery } from '@codeleap/web'
import { Text, View, Link, Icon, ActionIcon } from '..'

function UpdatePage(props) {
  const { pageContext, children } = props

  const version = pageContext?.version?.replace('_', '.')

  const mediaQuery = Theme.media.down('mid')
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  return (
    <Page
      title={version}
      responsiveVariants={{ mid: ['column'] }}
      center={false}
      contentStyle={styles.content}
    >
      {isMobile && <SectionMap content={pageContext?.tableOfContents?.items} />}

      <View variants={['flex', 'padding:4', 'column', 'alignStart', 'justifyStart', 'gap:2']}>
        <Link to={'/updates/'} variants={['noUnderline']}>
          <Icon name='chevron-left' size={24} />
        </Link>
        
        <View variants={['row', 'gap:2', 'center', 'marginBottom:2']}>
          <View variants={['border-radius:rounded', 'backgroundColor:primary1', 'paddingHorizontal:2', 'paddingVertical:1']}>
            <Text variants={['p1', 'color:primary3']} text={version} />
          </View>

          <Text variants={['h2']} text={pageContext?.title} />
        </View>

        <MDXProvider components={mdxTransforms}>
          {children}
        </MDXProvider>
      </View>

      {!isMobile && <SectionMap content={pageContext?.tableOfContents?.items} />}
    </Page>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  content: {
    height: '100%',
    minHeight: '90svh',
    paddingBottom: theme.spacing.value(3),

    [theme.media.down('mid')]: {
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
}), true)

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
