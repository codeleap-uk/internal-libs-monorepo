import { React, variantProvider, Theme } from '@/app'
import { Collapse } from '../Collapse'
import { MdxMetadata } from 'types/mdx'
import { onUpdate, useBooleanToggle } from '@codeleap/common'
import { Link } from '../Link'
import { View, Button, Drawer, Text } from '@/components'
import { Location } from '@reach/router'

type NavbarProps = {
  pages: [string, MdxMetadata[]][]
  title: string
  location: Location
}

const ArticleLink = ({ title, path, selected, isRoot }) => (
  <Link to={path} variants={['noUnderline']}>
    <Button
      text={title}
      onPress={() => null}
      variants={['docItem', 'hiddenIcon', selected && 'docItem:selected', !isRoot && 'docItem:list']}
    />
  </Link>
)

const Category = ({ name, items, location }) => {
  const [open, toggle] = useBooleanToggle(false)
  let selected = false

  const isRoot = name === 'Root'

  const _items = items.map((p, idx) => {
    const isSelected = location?.pathname?.includes(p?.path)
    if (isSelected) selected = true
    return <ArticleLink title={p.title} key={idx} path={'/' + p.path} selected={isSelected} isRoot={isRoot} />
  })

  if (isRoot) {
    return <>
      {_items}
    </>
  }

  onUpdate(() => {
    if (selected) toggle()
  }, [selected])

  return (
    <View variants={['column', 'fullWidth']}>
      <Button
        text={name}
        onPress={toggle}
        icon='chevron-right'
        variants={['docItem']}
        styles={{
          icon: {
            transform: `rotate(${open ? 90 : 0}deg)`,
          }
        }}
      />

      <Collapse open={open} height={items.length * 80} css={styles.collapsibleList}>
        {_items}
      </Collapse>
    </View>
  )
}

export const Navbar = ({ pages, title, location }: NavbarProps) => {
  const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)

  const isMobile = Theme.hooks.down('mid')

  const WrapperComponent = isMobile ? Drawer : View

  const Items = () => (
    <>
      {/* <Text variants={['h4', 'alignSelfCenter', 'marginVertical:2']} text={title} responsiveVariants={{ small: ['h3'] }}/> */}
      {pages.map?.(([category, items]) => {
        return <Category items={items} name={category} key={category} location={location} />
      })}
    </>
  )

  return <View variants={['column']} style={styles.sidebar}>
    {/* <Button variants={['circle']} icon='chevronLeft' styles={{
      icon: {
        transform: `rotate(${isDrawerOpen ? 0 : 180}deg)`,
        transition: 'transform 0.3s ease',
      },
      wrapper: {
        ...styles.toggleButton,
        transform: isMobile ? `scale(${isDrawerOpen ? 0 : 1})` : 'scale(0)',
      },
    }} onPress={toggleDrawer}/> */}

    <Items />

    {/* <WrapperComponent
      debugName='drawer'
      // css={styles.wrapper}
      open={isDrawerOpen}
      position='left'
      toggle={toggleDrawer}
      size='50%'
    >
      

    </WrapperComponent> */}
  </View>
}

const styles = variantProvider.createComponentStyle((theme) => ({
  // wrapper: {
  //   position: 'sticky',
  //   left: 0,
  //   bottom: 0,
  //   top: theme.values.headerHeight,
  //   maxHeight: theme.values.height - theme.values.headerHeight,
  //   overflowY: 'hidden',
  //   backgroundColor: theme.colors.background,
  //   ...theme.presets.column,
  //   ...theme.presets.alignSelfStretch,
  //   flexBasis: '20%',

  // },
  sidebar: {
    height: '100%',
    minHeight: '90svh',
    borderRight: `1px solid ${theme.colors.neutral3}`,
    paddingTop: 24,
  },
  toggleButton: {
    transition: 'transform 0.3s ease',
    ...theme.presets.fixed,
    zIndex: 1,
    right: theme.spacing.value(3),
    bottom: theme.spacing.value(3),
  },
  collapsibleList: {
    ...theme.presets.column,
  },
}), true)
