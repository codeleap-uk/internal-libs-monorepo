import { FlatList, FlatListProps } from 'react-native'
import { useTabContext } from './Context'
import React from 'react'

type TabListProps = Omit<FlatListProps<any>, 'data' | 'renderItem'>

export const TabList = (props: TabListProps) => {
  const { children, ...flatListProps } = props

  const { styles, flatListRef } = useTabContext()

  const childrenArray = React.Children.toArray(children)

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...flatListProps}
      ref={flatListRef}
      data={childrenArray}
      renderItem={({ item }) => item}
      keyExtractor={(_, index) => `tab-${index}`}
      style={styles?.tabList}
      contentContainerStyle={styles?.tabListContainer}
    />
  )
}