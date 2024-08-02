import React from 'react'
import { Text, View, Page, Link } from '@/components'

import updates from '../updates/index.json'
import { createStyles } from '@codeleap/styles'

export default () => {
  return <>
    <Page title='Updates' headerCenter={false}>
      <View style={styles.wrapper}>
        <Text style={['h1']} text={'Updates'} />
        <Text style={['h3', { fontWeight: 300 }]} text={'Important notes about specific versions of our libraries can be found below.'} />

        <View style={['separator']} />

        <View style={['marginTop:4', 'column', 'gap:2']}>
          {updates?.list?.map(({ version, path, title }) => (
            <Link key={String(version)} to={path} style={['noUnderline']}>
              <Text style={['h3', styles.version]} text={`${version} - ${title}`} />
            </Link>
          ))}
        </View>
      </View>
    </Page>
  </>
}

const styles = createStyles((theme) => ({
  title: {
    fontSize: 64,
    fontWeight: '900'
  },
  version: {
    transition: '.2s all',

    '&:hover': {
      marginLeft: theme.spacing.value(0.25),
      color: theme.colors.primary3
    }
  },
  wrapper: {
    width: '100vw',
    minHeight: '80vh',
    ...theme.presets.column,
    ...theme.spacing.gap(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    ...theme.spacing.paddingVertical(7),
  },
}))
