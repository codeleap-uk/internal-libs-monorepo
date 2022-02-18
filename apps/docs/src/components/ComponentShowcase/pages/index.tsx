import { React, allComponents, View, Button, variantProvider } from '@/app'
import { onUpdate, useCodeleapContext } from '@codeleap/common'
import { useState } from 'react'
import { Showcase } from '..'
import { ComponentList } from '../components/ComponentList'
import { showcasePropsMap } from '../data'

const defaultComponent = Object.keys(allComponents)[0]

export const ComponentShowcase: React.FC = () => {
  const [selectedComponent, setComponent] = useState(defaultComponent)
  const { currentTheme, Theme } = useCodeleapContext()

  return (
    <View variants={['full']}>
      <ComponentList onSelect={setComponent} current={selectedComponent} />
      <View
        variants={['flex']}
        css={{
          maxWidth: '80%',
        }}
      >
        {/* <Showcase
          {...showcasePropsMap[selectedComponent]}
          name={selectedComponent}
        /> */}
        <Button text={Theme.colors[currentTheme].background} onPress={() => variantProvider.setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}/>
      </View>
    </View>
  )
}
