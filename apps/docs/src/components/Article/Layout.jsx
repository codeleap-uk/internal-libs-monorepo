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
import { useMediaQuery } from '@codeleap/web'

const PageNavButton = ({ data, type = 'previous' }) => {
  const isNext = type === 'next'
  const onPress = () => navigate('/' + data.path)

  return (
    <Button 
      variants={['alignCenter', 'alignSelfEnd', 'docNavAction']} 
      onPress={onPress}
      disabled={!data}
    >
      {!isNext && <Icon name={'chevron-left'} size={24} color={Theme.colors.light.neutral7} />}

      <View variants={['column', 'fullHeight', 'alignStart', 'gap:1']}>
        <Text text={capitalize(type)} variants={['h5', 'color:primary3']} />
        <Text text={data?.title ?? 'Not found'} variants={['p2', 'color:neutral7', 'ellipsis']} />
      </View>

      {isNext && <Icon name={'chevron-right'} size={24} color={Theme.colors.light.neutral7} />}
    </Button>
  )
}

function ArticlePage(props) {
  const { pageContext, children, location } = props

  const allMdx = pageContext.allMdx
  const { title, description, source, tag } = pageContext.frontmatter

  const { pages, flatData, previous = null, next = null } = useMdx(allMdx, pageContext)

  const lib = pageContext?.isLibrary ? `@codeleap/${pageContext?.module}` : capitalize(pageContext?.module)

  const mediaQuery = Theme.media.down('mid')
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  const Footer = () => {
    return (
      <View 
        variants={['justifySpaceBetween', 'fullWidth', 'alignSelfEnd', 'flex', 'gap:2', 'marginVertical:2']}
        responsiveVariants={{ mid: ['column'] }}
      >
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
      searchBar={!isMobile && <SearchBar items={flatData} />}
    >
      <Navbar pages={pages} title={lib} location={location} />
      {isMobile && <SectionMap content={pageContext?.tableOfContents?.items} />}

      <Article title={title} description={description} source={source} lib={lib} tag={tag}>
        <MDXProvider components={mdxTransforms}>
          {children}
        </MDXProvider>

        <Footer />
      </Article>

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
        description
        source
        tag
      }
    }
  }
`

export default ArticlePage
