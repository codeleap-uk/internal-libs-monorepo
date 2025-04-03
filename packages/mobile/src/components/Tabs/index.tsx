import { AnyRecord } from '@codeleap/types'
import { View } from '../View'
import { TabsProvider } from './Context'
import { Panel } from './Panel'
import { Tab } from './Tab'
import { TabList } from './TabList'
import { TabsProps } from './types'
import { IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export { useTabContext } from './Context'

export * from './types'
export * from './styles'

export const Tabs = (props: TabsProps) => {
  const {
    style,
    value,
    onValueChange,
    defaultValue,
    keepMounted,
    children,
    ...rest
  } = {
    ...Tabs.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Tabs.styleRegistryName, style)

  return <View {...rest} style={styles?.wrapper}>
    <TabsProvider
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      styles={styles}
      keepMounted={keepMounted}
    >
      {children}
    </TabsProvider>
  </View>
}

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.Panel = Panel

Tabs.styleRegistryName = 'Tabs'
Tabs.elements = ['wrapper', 'tab', 'panel']
Tabs.rootElement = 'wrapper'

Tabs.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Tabs as ((props: StyledComponentProps<TabsProps, typeof styles>) => IJSX) & {
    Tab: typeof Tab,
    TabList: typeof TabList,
    Panel: typeof Panel,
  }
}

Tabs.defaultProps = {
  keepMounted: true,
} as Partial<TabsProps>

MobileStyleRegistry.registerComponent(Tabs)