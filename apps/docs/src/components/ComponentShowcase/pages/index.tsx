import { React, allComponents, View, Button, variantProvider } from '@/app'
import { onUpdate, useCodeleapContext } from '@codeleap/common'
import { useState } from 'react'
import { Showcase } from '..'
import { ComponentList } from '../components/ComponentList'
import { showcasePropsMap } from '../data'
import { Page } from '../../Page'
const defaultComponent = Object.keys(allComponents)[0]

export const ComponentShowcase: React.FC = () => {
  const [selectedComponent, setComponent] = useState(defaultComponent)
  const { currentTheme, Theme } = useCodeleapContext()

  return (
    <Page header={false} footer={false} styles={{ innerWrapper: styles.innerWrapper }}>
      <View >
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
      </View>
    </Page>
  )
}
const styles = variantProvider.createComponentStyle({
  innerWrapper: {
    maxHeight: '100vh',
  },
}, true)
