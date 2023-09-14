import React from 'react'
import { Text, View, Page, Link } from '@/components'
import { Settings, variantProvider } from '@/app'

const packages = [
  {
    url: '/common',
    name: '@codeleap/common',
    description:
      'The library that provides APIs for building portable and modular code on both platforms',
  },
  {
    url: '/web',
    name: '@codeleap/web',
    description: 'Components and hooks for building awesome websites',
  },
  {
    url: '/mobile',
    name: '@codeleap/mobile',
    description: 'Components and utilities for creating bleeding edge iOS and Android apps',
  },
]

export default () => {
  const renderItem = React.useCallback((item) => (
    <Link to={item?.url} variants={['column', 'padding:4', 'flex', 'gap:2']} style={styles.link}>
      <Text text={item?.name} variants={['h2']} />
      <Text text={item?.description} />
    </Link>
  ), [])

  return (
    <Page title='Home'>
      <View style={styles.wrapper}>
        <View variants={['column', 'gap:2']}>
          <Text text={Settings.AppName} variants={['h1']} />
          <Text text='Build your next website even faster with premade responsive components designed and built by Codeleap maintainers. All components are free forever for everyone.' variants={['p1']} />
        </View>

        <View variants={['row', 'gap:2', 'justifySpaceBetween', 'alignCenter']}>
          {packages?.map(renderItem)}
        </View>
      </View>
    </Page>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    width: '100vw',
    minHeight: '80vh',
    ...theme.presets.column,
    ...theme.spacing.gap(4),
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  link: {
    background: theme.colors.primary2,
    borderRadius: theme.borderRadius.medium,
    height: '100%',
    flex: 1,
    textDecoration: 'none',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }
}), true)
