import { React, allComponents, View, variantProvider, Theme } from '@/app'
import { useState } from 'react'
import { Showcase } from '..'
import { ComponentList } from '../components/ComponentList'
import { showcasePropsMap } from '../data'
import { Page } from '../../Page'
const defaultComponent = Object.keys(allComponents)[0]

export const ComponentShowcase: React.FC = () => {
  const [selectedComponent, setComponent] = useState(defaultComponent)

  return (
    <Page header={false} footer={false} center={false} styles={{ wrapper: styles.innerWrapper }}>
      <ComponentList onSelect={setComponent} current={selectedComponent} />
      <View
        variants={['flex']}
        css={{
          maxWidth: '80%',
        }}
      >
        <Showcase
          {...showcasePropsMap[selectedComponent]}
          name={selectedComponent}
        />
      </View>
    </Page>
  )
}
const styles = variantProvider.createComponentStyle({
  innerWrapper: {
    maxHeight: '100vh',
    overflowY: 'hidden',
    ...Theme.presets.row,
  },
}, true)
