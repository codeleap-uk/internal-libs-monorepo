import { graphql, navigate, useStaticQuery } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { useMdx } from '@/utils/hooks'
import { Page } from '../Page'
import { SectionMap } from './SectionMap'
import { mdxTransforms } from './mdxTransforms'
import { Navbar } from './Navbar'
import { Article } from './Article'
import { React, Icon, Theme, Touchable, View, Text, variantProvider } from '@/app'
import { Header } from '../Header'
import { SearchBar } from './SearchBar'
import { MdxMetadata } from 'types/mdx'
import { capitalize, useComponentStyle, useMemo } from '@codeleap/common'

const PageNavButton = ({ data, type = 'previous' }) => {
  const style = useComponentStyle(PageNavButtonStyles)
  const onPress = () => navigate(`/${data.module}/${data.path}`)
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
    width: '20%',
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
  const { title, next = null, previous = null } = pageContext.frontmatter
  const { allMdx } = useStaticQuery(query)

  const { pages, flatData } = useMdx(allMdx, pageContext.module)
  const isMobile = Theme.hooks.down('mid')

  const { nextPage, previousPage } = useMemo(() => {
    let nextPage:MdxMetadata = null
    let previousPage:MdxMetadata = null

    for (const p of flatData) {
      if (nextPage && previousPage) break

      if (`${p.module}/${p.path}` === previous) {
        previousPage = p
      } else if (`${p.module}/${p.path}` === next) {
        nextPage = p
      }
    }

    return { nextPage, previousPage }
  }, [next, previous])
  return <MDXProvider components={mdxTransforms}>
    <Page title={title} header={
      <Header >
        {!isMobile && <SearchBar items={flatData}/>}
      </Header>
    } responsiveVariants={{
      mid: ['column'],
    }}>
      <Navbar pages={pages} title={`@codeleap/${pageContext.module}`}/>
      {isMobile && <SearchBar items={flatData}/>}
      <Article>
        {children}
        {
          (nextPage || previousPage) && <>
            <View variants={['separator', 'marginVertical:3', 'fullWidth']} css={{ borderTopColor: Theme.colors.dark.neutral }} />
            <View variants={['justifySpaceBetween', 'fullWidth']}>
              {
                previousPage && <PageNavButton data={previousPage} type='previous'/>
              }
              {
                nextPage && <PageNavButton data={nextPage} type='next'/>
              }

            </View>
          </>
        }
      </Article>
      <SectionMap content={children}/>
      {/* </View> */}
    </Page>
  </MDXProvider>
}

export default ArticlePage

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
            next
            previous
          }
        }
      }
    }
}
`
