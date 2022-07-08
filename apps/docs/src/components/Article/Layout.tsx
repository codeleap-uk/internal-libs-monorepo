import { graphql, navigate, useStaticQuery } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from './utils'
import { Page } from '../Page'
import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { React, Icon, Theme, Touchable, View, Text, variantProvider } from '@/app'
import { Header } from '../Header'
import { SearchBar } from './SearchBar'
import { capitalize, useComponentStyle, useMemo } from '@codeleap/common'

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
    ...theme.border.neutral(1),
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: theme.colors.primary,
      'svg, p': {
        color: theme.colors.primary,
      },

    },
  },
  icon: {
    transition: 'color 0.2s ease',
    color: theme.colors.neutral,
    size: 25,
  },
  text: {
    color: theme.colors.neutral,
    transition: 'color 0.2s ease',
  },
}))

function ArticlePage({ children, pageContext }) {
  const { title } = pageContext.frontmatter
  const { allMdx } = useStaticQuery(query)

  const { pages, flatData, previous = null, next = null } = useMdx(allMdx, pageContext)

  const isMobile = Theme.hooks.down('mid')
  const navTitle = pageContext?.isLibrary ? `@codeleap/${pageContext?.module}` : capitalize(pageContext?.module)

  return <Page title={title} header={
    <Header >
      {!isMobile && <SearchBar items={flatData}/>}
    </Header>
  } responsiveVariants={{
    mid: ['column'],
  }} variants={['mainContent']}>
    <Navbar pages={pages} title={navTitle}/>
    {isMobile && <SearchBar items={flatData}/>}
    <Article>
      <MDXProvider components={mdxTransforms}>
        {children}
        {
          (next || previous) && <>
            <View variants={['separator', 'marginVertical:3', 'fullWidth']} css={{ borderTopColor: Theme.colors.dark.neutral }} />
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
    <SectionMap content={children}/>

  </Page>

}

export default ArticlePage

const query = graphql`
  query {
    allMdx(filter: {}) {
      edges {
        node {
          fileAbsolutePath
          frontmatter {
            title
          }
        }
      }
    }
}
`
