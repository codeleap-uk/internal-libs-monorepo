import { graphql, navigate } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from './utils'
import { Page } from '../Page'
// import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { Theme, variantProvider } from '@/app'
import { Icon,  Touchable, View, Text, Header } from '@/components'
import { SearchBar } from './SearchBar'
import { capitalize, useComponentStyle } from '@codeleap/common'

const PageNavButton = ({ data, type = 'previous' }) => {
  const style = useComponentStyle(PageNavButtonStyles)
  const onPress = () => navigate('/' + data.path)
  return <Touchable variants={['padding:1', 'gap:1', 'alignCenter']} onPress={onPress} css={style.wrapper}>
    {type === 'previous' && <Icon name='arrowBack' variants={['marginRight:auto']} style={style.icon}/>}
    <View variants={['column']}>
      <Text text={capitalize(type)} variants={['h6']} css={style.text}/>
      <Text text={data.title} css={style.text}/>
    </View>
    {type === 'next' && <Icon name='arrowForward' variants={['marginLeft:auto']} style={style.icon}/>}

  </Touchable>
}

const PageNavButtonStyles = variantProvider.createComponentStyle((theme) => ({
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
  icon: {
    transition: 'color 0.2s ease',
    color: theme.colors.neutral1,
    size: 25,
  },
  text: {
    color: theme.colors.neutral1,
    transition: 'color 0.2s ease',
  },
}))

function ArticlePage(props) {
  console.log({
    props
  })

  const { pageContext, pageResources, children } = props

  const allMdx = pageContext.allMdx
  const body = pageContext.body
  const { title } = pageContext.frontmatter

  const { pages, flatData, previous = null, next = null } = useMdx(allMdx, pageContext)

  const isMobile = Theme.hooks.down('mid')
  const navTitle = pageContext?.isLibrary ? `@codeleap/${pageContext?.module}` : capitalize(pageContext?.module)

  // const Content = require(`../../articles/${pageContext?.pagePath}.mdx`)

  console.log(`../../articles/${pageContext?.pagePath}.mdx`)

  return <Page title={title} header={
    <Header >
      {!isMobile && <SearchBar items={flatData}/>}
    </Header>
  } responsiveVariants={{
    mid: ['column'],
  }} variants={['mainContent']}>
    <Navbar pages={pages} title={navTitle}/>
    {isMobile && <SearchBar items={flatData}/>}

    <Article title={title}>
      <MDXProvider components={mdxTransforms}>
        {/* {compileMDX({ absolutePath: pageContext?.filePath, 'source': body }, { }, null, { })} */}
        {children}
        {
          (next || previous) && <>
            <View  css={style.bottomSeparator} />
            <View variants={['justifySpaceBetween', 'fullWidth']}>
              {
                previous && <PageNavButton data={previous} type='previous'/>
              }
              {
                next && <PageNavButton data={next} type='next'/>
              }

            </View>
          </>
        }
      </MDXProvider>
    </Article>
    {/* <SectionMap content={body}/> */}

  </Page>

}

const style = variantProvider.createComponentStyle(theme => ({
  bottomSeparator: {
    ...theme.presets.fullWidth
  }
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
