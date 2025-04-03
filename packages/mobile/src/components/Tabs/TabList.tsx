import { ScrollView, ScrollViewProps } from 'react-native'
import { useTabContext } from './Context'

type TabListProps = ScrollViewProps

export const TabList = (props: TabListProps) => {
  const { styles } = useTabContext()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}
      style={styles?.tabList}
      contentContainerStyle={styles?.tabListContainer}
    />
  )
}