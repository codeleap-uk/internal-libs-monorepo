import React from 'react'
import { Text, View, Page, Link, Button, Icon } from '@/components'
import { Settings, variantProvider } from '@/app'
import { Particles } from '../components/Particles'
import { navigate } from 'gatsby'
import Fade from 'react-reveal/Fade'

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
  const renderItem = React.useCallback((item, i) => (
    <Fade bottom delay={800 + (i * 250)}>
      <Link key={i + 'link'} to={item?.url + '/index'} variants={['noUnderline']}>
        <View style={styles.link}>
          <View variants={['backgroundColor:primary3', 'padding:1', 'border-radius:small']}>
            <Icon debugName='' name='layers' size={24} />
          </View>
          <Text text={item?.name} variants={['h5']} />
          <Text text={item?.description} variants={['p4']} />
        </View>
      </Link>
    </Fade>
  ), [])

  return <>
    <Page title='Home' headerCenter={false}>
      <View style={styles.wrapper}>
        <View variants={['column', 'gap:2']}>
          <Fade left>
            <Text 
              text={'A full featured library of React for mobile and web platforms'} 
              variants={['h1']}
              responsiveVariants={{ mid: ['h1'] }}
              style={styles.title}
            />
          </Fade>

          <Fade left>
            <Text 
              text='Create complete web and mobile applications with a single code with various hooks and features to create your project 2x faster' 
              variants={['h3', 'thin']}
              responsiveVariants={{ mid: ['p1'] }}
            />
          </Fade>
        </View>

        <View variants={['row', 'gap:4']} responsiveVariants={{ mid: ['column'] }}>
          {packages?.map(renderItem)}
        </View>

        <View variants={['row', 'gap:2']} responsiveVariants={{ mid: ['column'] }}>
          <Fade delay={1000}>
            <Button 
              variants={['padding:2', 'w:200px']}
              text='Get started' 
              onPress={() => navigate('/concepts/index/')} 
              styles={{
                'text': { fontWeight: 700 }
              }}
            />
          </Fade>
          
          <Fade delay={1200}>
            <Link variants={['noUnderline']} to='https://github.com/codeleap-uk/internal-libs-monorepo' target='_blank'>
              <Button 
                variants={['padding:2', 'w:200px']}
                text='GitHub'
                styles={{
                  'text': { fontWeight: 700 }
                }}
              />
            </Link>
          </Fade>
        </View>
      </View>
    </Page>

    <Particles id='particles-home' opacity={0.2} />
  </>
}

const styles = variantProvider.createComponentStyle((theme) => ({
  title: {
    fontSize: 64, // yes, it is quite
    fontWeight: '900'
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

    [theme.media.down('mid')]: {
      maxWidth: '100%'
    }
  },
}), true)
