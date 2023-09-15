import { graphql, navigate } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from './utils'
import { Page } from '../Page'
import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { Theme, variantProvider } from '@/app'
import { Button, View, Text, Icon } from '@/components'
import { SearchBar } from './SearchBar'
import { capitalize } from '@codeleap/common'

const PageNavButton = ({ data, type = 'previous' }) => {
  if (!data) return null

  const isNext = type === 'next'
  const onPress = () => navigate('/' + data.path)

  return (
    <Button 
      variants={['alignCenter', 'alignSelfEnd', 'docNavAction']} 
      onPress={onPress}
    >
      {!isNext && <Icon name={'chevron-left'} size={24} color={Theme.colors.light.neutral7} />}

      <View variants={['column', 'fullHeight', 'alignStart', 'gap:1']}>
        <Text text={capitalize(type)} variants={['h5', 'color:primary3']} />
        <Text text={data.title} variants={['p2', 'color:neutral7']} />
      </View>

      {isNext && <Icon name={'chevron-right'} size={24} color={Theme.colors.light.neutral7} />}
    </Button>
  )
}

function ArticlePage(props) {
  console.log({
    props
  })

  const { pageContext, children, location } = props

  const allMdx = pageContext.allMdx
  const { title, description, source, tag } = pageContext.frontmatter

  const { pages, flatData, previous = null, next = null } = useMdx(allMdx, pageContext)

  const lib = pageContext?.isLibrary ? `@codeleap/${pageContext?.module}` : capitalize(pageContext?.module)

  const Footer = () => {
    return (
      <View variants={['justifySpaceBetween', 'fullWidth', 'alignSelfEnd', 'flex', 'gap:2', 'marginVertical:2']}>
        <PageNavButton data={previous} type='previous' />
        <PageNavButton data={next} type='next' />
      </View>
    )
  }

  return (
    <Page
      title={title}
      responsiveVariants={{ mid: ['column'] }}
      center={false}
      contentStyle={styles.content}
      searchBar={<SearchBar items={flatData} />}
    >
      <Navbar pages={pages} title={lib} location={location} />

      <Article title={title} description={description} source={source} lib={lib} tag={tag}>
        <MDXProvider components={mdxTransforms}>
          {children}
        </MDXProvider>

        <Footer />
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
    height: '100%',
    minHeight: '90svh',
  },
  icon: {
    transition: 'color 0.2s ease',
    color: theme.colors.neutral1,
    size: 25,
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
        description
        source
        tag
      }
    }
  }
`

export default ArticlePage
