import React from 'react'
import { Text, View, Page, Link, Button, Icon } from '@/components'
import { Particles } from '../components/Particles'
import { navigate } from 'gatsby'
import Fade from 'react-reveal/Fade'
import { createStyles } from '@codeleap/styles'

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
  const RenderItem = React.useCallback(({ item, i }) => (
    <Fade bottom delay={800 + (i * 250)}>
      <Link key={i + 'link'} to={item?.url + '/index'} style={['noUnderline']}>
        <View style={styles.link}>
          <View style={['backgroundColor:primary3', 'padding:1', 'borderRadius:small']}>
            <Icon debugName='' name='layers' size={24} />
          </View>
          <Text text={item?.name} style={['h5']} />
          <Text text={item?.description} style={['p4']} />
        </View>
      </Link>
    </Fade>
  ), [])

  return <>
    <Page title='Home' headerCenter={false}>
      <View style={styles.wrapper}>
        <View style={['column', 'gap:2']}>
          <Fade left>
            <Text 
              text={'A full featured library of React for mobile and web platforms'} 
              style={['h1']}
              style={styles.title}
            />
          </Fade>

          <Fade left>
            <Text 
              text='Create complete web and mobile applications with a single code with various hooks and features to create your project 2x faster' 
              style={['h3', 'thin']}
            />
          </Fade>
        </View>

        <View style={['row', 'gap:4', { breakpoints: { tabletSmall: 'column' } }]}>
          {packages?.map((item, i) => <RenderItem item={item} i={i} key={'package-' + i} />)}
        </View>

        <View style={['row', 'gap:2']}>
          <Fade delay={1000}>
            <Button 
              style={['padding:2', 'w:200px']}
              text='Get started' 
              onPress={() => navigate('/concepts/index/')} 
              styles={{
                'text': { fontWeight: 700 }
              }}
            />
          </Fade>
          
          <Fade delay={1200}>
            <Link style={['noUnderline']} to='https://github.com/codeleap-uk/internal-libs-monorepo' target='_blank'>
              <Button 
                style={['padding:2', 'w:200px']}
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

const styles = createStyles((theme) => ({
  title: {
    fontSize: 64, // yes, it is quite
    fontWeight: '900',
    color: '#000'
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

    [theme.media.down('tabletSmall')]: {
      maxWidth: '100%'
    }
  },
}))
