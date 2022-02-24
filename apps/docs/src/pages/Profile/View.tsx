import * as React from 'react'
import { Session, useAppSelector } from '@/redux'
import { Button, Image, Scroll, List, Text, Theme, variantProvider, View, logger, Settings } from '@/app'

import { Avatar } from '@/components'

const menuButtons = [
  {
    name: 'Edit',
    run: (navigation) => navigation.navigate('Profile.Edit'),
  },
  {
    name: 'About this App',
    run: (navigation) => navigation.navigate('Profile.About'),
  },
  {
    name: 'Terms of Use...',
    run: () => null,
  },
  {
    name: 'Logout',
    run: () => Session.logout(),
  },
]

export default function ViewProfile({ navigation }) {
  const { profile } = useAppSelector((store) => store.Session)
  if (!profile) return null // Only until auth is done

  function renderHeader() {
    return (
      <View variants={['center', 'marginVertical:2']}>
        <Avatar profile={profile} variants={['marginTop:2']} debugName={'Render Avatar'}/>
        <Text text={`${profile.first_name} ${profile.last_name}`} variants={['h1', 'marginTop:2']} />
        <Text text={profile.email} variants={['h3', 'marginVertical:1']} />
      </View>
    )
  }

  function renderItem({ item, index }) {
    const { name, run } = item
    return (
      <Button
        text={name}
        debugName={`Render ${name}`}
        // onPress={() => run(navigation)}
        variants={['list', index === 0 ? 'list:first' : 'list']}
      />
    )
  }

  return (
    <View style={styles.wrapper}>
      <List
        data={menuButtons}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      />
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    // marginTop: Theme.values.safeAreaTop,
  },
})
