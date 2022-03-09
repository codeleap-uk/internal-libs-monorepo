import React from 'react'
import { Text } from '../Text'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  IconPlaceholder,

  StylesOf,
  useCodeleapContext,
} from '@codeleap/common'
import { url } from '../../lib/utils'
import { Link as IntlLink } from 'gatsby'
import { MenuComposition } from './styles'

const RouterLink: React.FC<any> = (props) => (
  <Link component={IntlLink} {...props} />
)

export type MenuItemProps = {
  data: {
    icon: IconPlaceholder
    title: string
    path: string
  }
  styles: StylesOf<MenuComposition>
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { styles } = props
  const { title, path, icon } = props.data

  const { pathname } = url()

  const selected = pathname.includes(path)
  const { Theme } = useCodeleapContext()
  const isMobile = Theme.hooks.down('small')

  if (isMobile) {
    return (
      <RouterLink to={path} css={[styles['menuItem:mobile']]}>
        <Text
          variant={'p3'}
          css={[
            styles['menuItem:text:mobile'],
            selected && styles['menuItem:text:selected'],
          ]}
          text={title}
        />
        <Icon name={icon} style={{
          ...styles['menuItem:icon:mobile'],
          ...selected && styles['menuItem:icon:mobile:selected'],
        }}/>
      </RouterLink>
    )
  }

  return (
    <RouterLink to={path} css={[styles.menuItem]}>
      <Icon name={icon} style={{
        ...styles['menuItem:icon'],
        ...selected && styles['menuItem:icon:selected'],
      }}/>
      <Text
        variant={'p3'}
        css={[
          styles['menuItem:text'],
          selected && styles['menuItem:text:selected'],
        ]}
        text={title}
      />
    </RouterLink>
  )
}
