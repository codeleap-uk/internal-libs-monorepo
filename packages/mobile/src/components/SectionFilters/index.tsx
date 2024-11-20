import { memoBy, TypeGuards } from '@codeleap/common'
import { Button } from '../Button'
import { AugmentedSectionRenderItemInfo, SectionComponentProps, Sections } from '../Sections'
import { Text } from '../Text'
import { SectionsFilterContext, useSectionFiltersContext } from './context'
import { SectionFilterComponentProps, SectionFiltersProps } from './types'
import { TSectionFilterItem, useSectionFilters } from './useSectionFilters'

export * from './types'
export * from './context'
export * from './useSectionFilters'

const SectionComponent = memoBy((props: SectionComponentProps<TSectionFilterItem> & { renderWith: (props: SectionFilterComponentProps<TSectionFilterItem>) => JSX.Element }) => {
  const { renderWith: Component, index } = props

  const handle = useSectionFiltersContext()

  if (!Component) return null

  return (
    <Component
      {...props} 
      selectedItems={handle.selectedItems[index] ?? []}
      clearSelectedItems={() => handle.clearSelectedItemsWithSection(index)}
    />
  )
}, ['renderWith'])

export function SectionFilters<T extends TSectionFilterItem = TSectionFilterItem>(props: SectionFiltersProps<T>) {
  const {
    sections,
    renderItem: RenderItem,
    renderSectionHeader,
    renderSectionFooter,
    children,
    ...rest
  } = {
    ...SectionFilters.defaultProps,
    ...props,
  }

  const handle = props.handle ?? useSectionFilters(props)

  const renderItem = (section: AugmentedSectionRenderItemInfo<T>) => {
    const hasSection = !TypeGuards.isNil(section?.index) && !TypeGuards.isNil(section)
    const sectionLimitReached = hasSection && handle.sectionLimitReached(section?.index)
    const limitReached = handle.limitReached()
    const disableOnReachLimit = handle.disableItemsOnLimitReached
    const disableNonSelectedItems = (limitReached || sectionLimitReached) && disableOnReachLimit

    const isSelected = handle.isSelected(section?.item)
    const isDisabled = disableNonSelectedItems && !isSelected

    return (
      <RenderItem
        {...section}
        onPress={() => handle.toggleItem(section?.item)}
        selected={isSelected}
        disabled={isDisabled}
        text={section?.item?.label}
      />
    )
  }

  return (
    <SectionsFilterContext.Provider value={handle}>
      <Sections
        {...rest}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={(props) => <SectionComponent {...props} renderWith={renderSectionHeader} />}
        renderSectionFooter={(props) => <SectionComponent {...props} renderWith={renderSectionFooter} />}
      />
      {children}
    </SectionsFilterContext.Provider>
  )
}

SectionFilters.defaultProps = {
  renderItem: Button as unknown,
  renderSectionHeader: ({ title }) => <Text text={title} />
} as Partial<SectionFiltersProps>
