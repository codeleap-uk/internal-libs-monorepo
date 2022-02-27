import * as allComponents from '../showCases'
import { View, Button, Scroll, Link, React, TextInput, variantProvider } from '@/app'
import { useCodeleapContext, useComponentStyle, useMemo, useState } from '@codeleap/common'
import { Logo } from '../../Logo'

export const ComponentList: React.FC<{
  onSelect: (name: string) => void
  current: string
}> = ({ onSelect, current }) => {
  const [search, setSearch] = useState('')

  const list = useMemo(() => {
    if (!search) return Object.keys(allComponents)

    return Object.keys(allComponents).filter((name) => name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  const { currentTheme } = useCodeleapContext()
  const styles = useComponentStyle(componentStyle)
  return (
    <View
      variants={['column', 'padding:1']}
      css={{
        maxWidth: '20%',
      }}
    >
      <Link
        css={styles.logoLink}
        to='/'
      >
        <Logo variants={currentTheme === 'dark' ? 'white' : 'black'} />
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
        debugName={'Search Component input'}
        variants={['marginVertical:2']}
      />
      <Scroll variants={['column', 'flex']}>
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
      </Scroll>
    </View>
  )
}

const componentStyle = variantProvider.createComponentStyle(() => ({
  logoLink: { maxWidth: '80%', height: 'auto', alignSelf: 'center', display: 'flex', justifyContent: 'center' },
}))
