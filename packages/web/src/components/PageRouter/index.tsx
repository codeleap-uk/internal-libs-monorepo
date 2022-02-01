import { View } from '../View'
import React, { useMemo } from 'react'

import { Menu } from './Menu'
import { Router } from './Router'
import { ComponentVariants, IconPlaceholder, PageRouterComposition, PageRouterStyles, useComponentStyle } from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { Helmet } from 'react-helmet'
import { url } from '../../lib/utils'

export type RouteProps = {
  title?: string
  path?: string
  menuIcon?: IconPlaceholder
  
}

export * from './Router'

type RouterPageProps = {
  basePath:string 
  styles?: StylesOf<PageRouterComposition>
  title?: string
} & ComponentVariants<typeof PageRouterStyles>

export const RouterPage:React.FC<RouterPageProps> = (props) => {
  const {children,  basePath,  variants, title: pageGroupTitle, responsiveVariants, styles} = props
  const pathName = url().pathname

  const {menuItems, defaultPath} = useMemo(() => {
    const items = []
    
    let defaultPath = ''

    React.Children.forEach(children, (c) => {
      if (React.isValidElement(c) && c.props){
        const {title, path, menuIcon} = c.props
        if ([title, path, menuIcon].some((i) => !i)){
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

  const variantStyles = useComponentStyle('PageRouter', {variants, responsiveVariants, styles})
  
  const currentPage = menuItems.find(({path}) => pathName.includes(path))
  return <View css={variantStyles.wrapper}>
    <Helmet>
      <title>
        {(pageGroupTitle ? `${pageGroupTitle} | ` : '') + (currentPage ? currentPage?.title : '') }
      </title>
    </Helmet>
    <Menu 
      items={menuItems}
      styles={variantStyles}
    />
    <View css={variantStyles.content}>
      <Router
        defaultPath={defaultPath}
        basePath={basePath}
        style={variantStyles.router}
      >
        {children}
      </Router>
    </View>
  </View>
  
}
