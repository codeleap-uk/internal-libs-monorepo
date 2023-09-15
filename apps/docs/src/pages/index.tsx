import React from 'react'
import { Text, View, Page, Link, Button, Icon } from '@/components'
import { Settings, variantProvider } from '@/app'
import { Particles } from '../components/Particles'
import { navigate } from 'gatsby'

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
    <Link to={item?.url + '/index'} variants={['noUnderline']}>
      <View style={styles.link}>
        <View variants={['backgroundColor:primary3', 'padding:1', 'border-radius:small']}>
          <Icon debugName='' name='layers' size={24} />
        </View>
        <Text text={item?.name} variants={['h5']} />
        <Text text={item?.description} variants={['p4']} />
      </View>
    </Link>
  ), [])

  return <>
    <Page title='Home' headerCenter={false}>
      <View style={styles.wrapper}>
        <View variants={['column', 'gap:2']}>
          <Text text={'A full featured library of React for mobile and web platforms'} variants={['h1']} style={styles.title} />
          <Text text='Create complete web and mobile applications with a single code with various hooks and features to create your project 2x faster' variants={['h3']} />
        </View>

        <View variants={['row', 'gap:4']}>
          {packages?.map(renderItem)}
        </View>

        <View variants={['row', 'gap:2']}>
          <Button variants={['padding:2', 'w:200px']} text='Get started' onPress={() => navigate('/concepts/index/')} />
          
          <Link variants={['noUnderline']} to='https://github.com/codeleap-uk/internal-libs-monorepo' target='_blank'>
            <Button variants={['padding:2', 'w:200px']} text='GitHub' />
          </Link>
        </View>
      </View>
    </Page>

    <Particles id='particles-home' opacity={0.2} />
  </>
}

const styles = variantProvider.createComponentStyle((theme) => ({
  title: {
    fontSize: 64,
    fontWeight: 'bold'
  },
  wrapper: {
    width: '100vw',
    minHeight: '80vh',
    ...theme.presets.column,
    ...theme.spacing.gap(7),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    ...theme.spacing.paddingVertical(7),
  },
  link: {
    maxWidth: 250,
    ...theme.presets.column,
    ...theme.spacing.gap(1.5),
    textDecoration: 'none',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}), true)
