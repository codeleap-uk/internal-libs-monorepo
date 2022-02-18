import * as allComponents from '../showCases'
import { View, Button, Theme, Link, React, Image, TextInput } from '@/app'
import { useMemo, useState } from 'react'
import { useCodeleapContext } from '@codeleap/common'

export const ComponentList: React.FC<{
  onSelect: (name: string) => void;
  current: string;
}> = ({ onSelect, current }) => {
  const [search, setSearch] = useState('')

  const list = useMemo(() => {
    if (!search) return Object.keys(allComponents)

    return Object.keys(allComponents).filter((name) => name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])
 

  return (
    <View
      variants={['column', 'padding:1']}
      css={{ maxWidth: '20%' }}
    >
      <Link
        css={{ maxWidth: '80%', height: 'auto', alignSelf: 'center' }}
        to='/'
      >
        <Image source='logo_white.webp' />
      </Link>
      <TextInput
        placeholder='Search'
        leftIcon={{
          name: 'search',
        }}
        rightIcon={
          search && {
            name: 'close',
            action: () => setSearch(''),
          }
        }
        onChangeText={setSearch}
        value={search}
        variants={['marginVertical:2']}
      />
      <View variants={['column', 'scrollY']}>
        {list.map((name) => (
          <Button
            text={name}
            key={name}
            onPress={() => onSelect(name)}
            variants={[
              'paddingHorizontal:5',
              'paddingVertical:1',
              'list',
              name === current ? 'list:selected' : 'list',
            ]}
          />
        ))}
      </View>
    </View>
  )
}
