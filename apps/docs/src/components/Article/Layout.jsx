import { graphql, navigate } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from './utils'
import { Page } from '../Page'
import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { Theme, variantProvider } from '@/app'
import { Button, View, Text } from '@/components'
import { SearchBar } from './SearchBar'
import { capitalize } from '@codeleap/common'

const PageNavButton = ({ data, type = 'previous' }) => {
  const onPress = () => navigate('/' + data.path)

  return (
    <Button variants={['padding:1', 'gap:1', 'alignStart', 'column']} onPress={onPress}>
      <Text text={capitalize(type)} variants={['h6']} css={styles.text} />
      <Text text={data.title} css={styles.text} />
    </Button>
  )
}

function ArticlePage(props) {
  console.log({
    props
  })

  const { pageContext, children } = props

  const allMdx = pageContext.allMdx
  const { title } = pageContext.frontmatter

  const { pages, flatData, previous = null, next = null } = useMdx(allMdx, pageContext)

  const isMobile = Theme.hooks.down('mid')
  const navTitle = pageContext?.isLibrary ? `@codeleap/${pageContext?.module}` : capitalize(pageContext?.module)

  console.log(pages)

  return (
    <Page
      title={title}
      responsiveVariants={{ mid: ['column'] }}
      center={false}
      contentStyle={styles.content}
    >
      <Navbar pages={pages} title={navTitle} />
      {/* <SearchBar items={flatData} /> */}

      <Article title={title}>
        <MDXProvider components={mdxTransforms}>
          {children}

          {
            (next || previous) && <>
              <View variants={['justifySpaceBetween', 'fullWidth']}>
                {
                  previous && <PageNavButton data={previous} type='previous' />
                }
                {
                  next && <PageNavButton data={next} type='next' />
                }

              </View>
            </>
          }
        </MDXProvider>
      </Article>

      <SectionMap content={children} />
    </Page>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.border.neutral1(1),
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',

    '&:hover': {
      borderColor: theme.colors.primary1,
      'svg, p': {
        color: theme.colors.primary1,
      },
    },
  },
  content: {
    marginTop: 24,
    paddingLeft: 24,
    paddingRight: 24,
    height: '100%',
  },
  icon: {
    transition: 'color 0.2s ease',
    color: theme.colors.neutral1,
    size: 25,
  },
  text: {
    color: theme.colors.neutral1,
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

export default ArticlePage
