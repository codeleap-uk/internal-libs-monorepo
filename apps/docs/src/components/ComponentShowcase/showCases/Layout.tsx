import React, { useState } from 'react'
import { onMount } from '@codeleap/common'

import {
  View,
  variants,
  ContentView,
  Text,
  Button,
  api,
  Touchable,
  List,
} from '@/app'
import { useAppSelector } from '@/redux'

import { ShowcasePropsMap } from './shared'
import { Posts } from '@/redux'
import { PostCard } from '@/components/PostCard'

const ViewShowcase: ShowcasePropsMap['View'] = {
  render: ({ variants, controlValues }) => {
    const nItems = Number(controlValues.numberOfItems)
    if (Number.isNaN(nItems)) return null
    return (
      <View variants={variants} css={{ background: 'red' }}>
        {Array(nItems)
          .fill(0)
          .map((_, idx) => (
            <Text text='Im red so you can see' key={idx} />
          ))}
      </View>
    )
  },
  styleSheet: variants.View,
  controls: {
    numberOfItems: '12',
  },
  filter: false,
}
const ContentViewShowcase = {
  render: () => {
    const [user, setUser] = useState(null)
    const [isFetching, setFetching] = useState(false)

    async function getUser() {
      setFetching(true)
      const { data } = await api.get('/api?results=1', {
        baseURL: 'https://randomuser.me',
      })

      setUser(data.results[0])
      setFetching(false)
    }

    return (
      <>
        <Button text='Get a user' onPress={getUser} />
        <ContentView placeholderMsg='Nothing to show' loading={isFetching}>
          {user ? (
            <Text text={`${user.name.first} is ${user.dob.age}`} />
          ) : null}
        </ContentView>
      </>
    )
  },
  styleSheet: variants.ContentView,
}
const FlatListShowcase = {
  render: () => {
    const { posts, loading, error } = useAppSelector((store) => store.Posts)

    onMount(() => {
      Posts.getData()
    })

    return (
      <ContentView
        variants={['column', 'alignStart', 'full']}
        placeholderMsg={error?.message || 'Fetching data...'}
        loading={loading}
      >
        <List data={posts} getSize={(item) => 130} renderItem={({ item, style }) => <PostCard post={item} style={style}/>} />
      </ContentView>
    )
  },

  styleSheet: {},
}

const TouchableShowcase = {
  render: () => {
    return <Touchable onPress={() => alert('Good job')}
      debugName={'Touchable showcase'}>Touch me</Touchable>
  },

  styleSheet: variants.Touchable,
}

export {
  ViewShowcase as View,
  FlatListShowcase as FlatList,
  ContentViewShowcase as ContentView,
  TouchableShowcase as Touchable,
}