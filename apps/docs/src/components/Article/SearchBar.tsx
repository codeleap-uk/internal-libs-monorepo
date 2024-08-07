import { React } from '@/app'
import { capitalize, useDebounce, useMemo, useState } from '@codeleap/common'
import { MdxMetadata } from 'types/mdx'
import { Collapse } from '../Collapse'
import { Link } from '../Link'
import { View, TextInput, Text } from '@/components'
import { createStyles } from '@codeleap/styles'

export const SearchBar = (props: { items: MdxMetadata[] }) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 400)

  const { results, hasResults } = useMemo(() => {
    if (!debouncedSearch) {
      return {
        results: {},
        hasResults: false,
      }
    }

    const results = props.items
      .reduce((acc, item) => {
        const searchTerm = debouncedSearch.toLowerCase()
        const match = [
          item.title.toLowerCase(),
          item.category ? item.category.toLowerCase() : '',
          item.module.toLowerCase(),
        ].some(prop => prop.includes(searchTerm))
        if (!match) return acc
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

  const resultList = hasResults ? Object.entries<MdxMetadata[]>(results).map(([moduleName, moduleResults], idx, arr) => {
    return (
      <View style={[
        'column',
        'gap:2',
      ]}>
        <Text text={`@codeleap/${moduleName}`} />
        {moduleResults.map(({ title, path, category }) => (
          <Link style={styles.result} to={`/${path}`}>
            <Text text={title} style={['inline']} />
            {
              category !== 'root' ?
                <Text text={`- ${capitalize(category)}`} style={['inline', 'marginLeft:1']} />
                : null
            }
          </Link>
        ))}
      </View>
    )
  }) : null

  const isDropdownOpen = debouncedSearch.length > 0

  const NotFound = () => {
    return <View style={['fullHeight', 'center', 'flex']}>
      <Text text={'No results found'} />
    </View>
  }

  return (
    <View style={styles.wrapper} id='SearchBar'>
      <TextInput
        leftIcon={{
          name: 'search',
          iconProps: { size: 16 }
        }}
        debugName='SearchBar'
        placeholder='Search'
        style={['pill', 'fullWidth', 'noError', 'docSearch']}
        onChangeText={setSearch}
        value={search}
      />

      <Collapse 
        css={[
          styles.dropdown,
          isDropdownOpen && styles['dropdown:open']
        ]} 
        open={isDropdownOpen && search?.length > 0} 
        height={MIN_HEIGHT} 
        scroll
      >
        {hasResults ? resultList : <NotFound />}
      </Collapse>
    </View>
  )
}

const MIN_HEIGHT = 250

const styles = createStyles((theme) => ({
  wrapper: {
    ...theme.spacing.marginRight(2),
    ...theme.presets.relative,
    ...theme.presets.center,

    [theme.media.down('tabletSmall')]: {
      order: -2,
      ...theme.spacing.marginHorizontal(1),
      ...theme.presets.alignSelfStretch,
    },
  },
  dropdown: {
    ...theme.presets.absolute,
    ...theme.presets.column,
    gap: theme.spacing.value(2),
    left: 0,
    right: 0,
    top: 50,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    border: 'none'
  },
  'dropdown:open': {
    ...theme.effects.light,
    padding: theme.spacing.value(2),
    minHeight: MIN_HEIGHT,
  },
  result: {
    ...theme.spacing.marginLeft(3),
  },
}))
