import { View } from '../View'
import React, { useMemo } from 'react'

import { Menu } from './Menu'
import { Router } from './Router'
import {
  ComponentVariants,
  IconPlaceholder,

  useDefaultComponentStyle,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { Helmet } from 'react-helmet'
import { url } from '../../lib/utils'
import { RouterPageComposition, RouterPageStyles } from './styles'

export * from './styles'

export type RouteProps = {
  title?: string
  path?: string
  menuIcon?: IconPlaceholder
}
type ContentProps = {
  styles: StylesOf<RouterPageComposition>
  menuItems: {
    icon: string
    title: string
    path: string
  }[]
}
export * from './Router'
export * from './Menu'
export * from './MenuItem'

type RouterPageProps = {
  basePath: string
  styles?: StylesOf<RouterPageComposition>
  title?: string
  renderContentWrapper?: React.FC<ContentProps>
} & ComponentVariants<typeof RouterPageStyles>

export const RouterPage: React.FC<RouterPageProps> = (props) => {
  const {
    children,
    basePath,
    variants,
    title: pageGroupTitle,
    responsiveVariants,
    styles,
    renderContentWrapper,
  } = props
  const pathName = url().pathname

  const { menuItems, defaultPath } = useMemo(() => {
    const items = []

    let defaultPath = ''

    React.Children.forEach(children, (c) => {
      if (React.isValidElement(c) && c.props) {
        const { title, path, menuIcon } = c.props
        if ([title, path, menuIcon].some((i) => !i)) {
          return
        }
        if (c.props.default) defaultPath = path
        items.push({
          ...c.props,
          title,
          path: `${basePath}${path}`,
          icon: menuIcon,
        })
      }
    })

    return {
      menuItems: items,
      defaultPath,
    }
  }, [children])

  const variantStyles = useDefaultComponentStyle('u:RouterPage', {
    variants,
    responsiveVariants,
    styles,
  })

  const currentPage = menuItems.find(({ path }) => pathName.includes(path))

  const Content = renderContentWrapper
  return (
    <View css={variantStyles.wrapper}>
      <Helmet>
        <title>
          {(pageGroupTitle ? `${pageGroupTitle} | ` : '') +
            (currentPage ? currentPage?.title : '')}
        </title>
      </Helmet>
      {renderContentWrapper ? (
        <Content styles={variantStyles} menuItems={menuItems}>
          <Router
            defaultPath={defaultPath}
            basePath={basePath}
            style={variantStyles.router}
          >
            {children}
          </Router>
        </Content>
      ) : (
        <>
          <Menu items={menuItems} styles={variantStyles} />
          <View css={variantStyles.content}>
            <Router
              defaultPath={defaultPath}
              basePath={basePath}
              style={variantStyles.router}
            >
              {children}
            </Router>
          </View>
        </>
      )}
    </View>
  )
}
