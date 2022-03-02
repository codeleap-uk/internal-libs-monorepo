/** @jsx jsx */
import { jsx } from '@emotion/react'

import { React, TextInput, Text, variantProvider, View } from '@/app'
import { onUpdate, useComponentStyle, useDebounce, useMemo, useState } from '@codeleap/common'
import { useClickOutside } from '@codeleap/web'
import { MdxMetadata } from 'types/mdx'
import { Collapse } from '../Collapse'
import { Link } from '../Link'

export const SearchBar = (props:{items:MdxMetadata[]}) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 400)
  const [focus, setFocus] = useState(false)

  const { results, hasResults } = useMemo(() => {
    if (!debouncedSearch) {
      return {
        results: {},
        hasResults: false,
      }
    }

    const results = props.items
      .reduce((acc, item) => {
        if (!item.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return acc
        const copy = { ...acc }

        if (copy[item.module]) {
          copy[item.module].push(item)
        } else {
          copy[item.module] = [item]
        }

        return copy
      }, {})

    return {
      results,
      hasResults: Object.keys(results).length > 0,
    }

  }, [debouncedSearch])

  const styles = useComponentStyle(componentStyles)

  const resultList = hasResults ? Object.entries<MdxMetadata[]>(results).map(([moduleName, moduleResults], idx, arr) => {
    return <View variants={[
      idx === 0 ? 'marginTop:2' : 'marginTop:0',
      idx === arr.length - 1 ? 'marginBottom:2' : 'marginBottom:0',
      'column',
      'gap:2',
    ]} css={styles.resultWrapper}>
      <Text text={`@codeleap/${moduleName}`}/>
      {moduleResults.map(({ title, path }) => (
        <Link css={styles.result} text={title} to={`/${moduleName}/${path}`}/>
      ))}
    </View>
  }) : null

  const isDropdownOpen = debouncedSearch.length > 0

  useClickOutside(() => {
    setFocus(false)
  }, {
    deps: [],
    customId: 'SearchBar',
  })

  onUpdate(() => {
    if (debouncedSearch.length) {
      setFocus(true)
    }
  }, [debouncedSearch])

  return <View css={styles.wrapper} id='SearchBar'>
    <TextInput
      leftIcon={{
        name: 'search',
      }}
      placeholder='What are you looking for?'
      variants={['pill', 'fullWidth']}
      onChangeText={setSearch}
      value={search}
      onFocus={ () => setFocus(true)}
    />
    <Collapse css={[
      styles.dropdown,
      isDropdownOpen && {
        boxShadow: '0 0 1px 2px #0002',
      },
    ]} open={isDropdownOpen && focus} height={300}>
      {
        hasResults ?
          resultList :
          <Text text={'No results found'} variants={['alignSelfCenter', 'marginHorizontal:auto', 'marginVertical:2']} />
      }
    </Collapse>
  </View>
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.spacing.marginRight('auto'),
    ...theme.presets.relative,
    flex: 0.6,
    [theme.media.down('small')]: {
      order: -2,
      ...theme.spacing.marginHorizontal(1),
      ...theme.spacing.marginVertical(2),
      ...theme.presets.alignSelfStretch,
    },
  },
  dropdown: {
    ...theme.presets.absolute,
    ...theme.presets.column,
    // ...theme.spacing.gap(2),
    left: 0,
    right: 0,
    top: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,

  },
  result: {
    ...theme.spacing.marginLeft(3),
  },
  resultWrapper: {
    ...theme.spacing.padding(1.5),
  },
}))
