import { React, variantProvider, Theme } from '@/app'
import { Collapse } from '../Collapse'
import { MdxMetadata } from 'types/mdx'
import { onUpdate, useBooleanToggle } from '@codeleap/common'
import { Link } from '../Link'
import { View, Button, Drawer } from '@/components'
import { Location } from '@reach/router'
import { useMediaQuery } from '@codeleap/web'

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
    <View variants={['column', 'fullWidth', 'gap:0.5']}>
      <Button
        text={name}
        onPress={toggle}
        icon='chevron-right'
        variants={['docItem']}
        styles={{
          text: {
            fontWeight: 900
          },
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

export const Navbar = ({ pages, location }: NavbarProps) => {
  const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)

  const isMobile = useMediaQuery(Theme.media.down('mid'), { getInitialValueInEffect: false })

  const Items = () => <>
    {pages.map?.(([category, items]) => {
      return <Category items={items} name={category} key={category} location={location} />
    })}
  </>

  return <View variants={['column', 'gap:0.5']} style={styles.sidebar}>
    {isMobile && <Button text='Open navigation' onPress={toggleDrawer} variants={['docNavbar']} />}

    {!isMobile && <Items />}

    {isMobile && (
      <Drawer
        debugName='drawer'
        open={isDrawerOpen}
        position='left'
        toggle={toggleDrawer}
        size='85vw'
      >
        <Items />
      </Drawer>
    )}
  </View>
}

const SECTION_WIDTH = 280

const styles = variantProvider.createComponentStyle((theme) => ({
  sidebar: {
    height: '100%',
    position: 'static',
    minWidth: SECTION_WIDTH,
    maxWidth: SECTION_WIDTH,
    minHeight: '90svh',
    borderRight: `1px solid ${theme.colors.neutral3}`,
    paddingTop: theme.spacing.value(3),

    [theme.media.down('mid')]: {
      minWidth: '100vw',
      maxWidth: '100vw',
      minHeight: 'unset',
      paddingTop: 0,
    }
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
