import { React, theme } from '@/app'
import { Collapse } from '../Collapse'
import { MdxMetadata } from 'types/mdx'
import { onUpdate, useBooleanToggle } from '@codeleap/common'
import { Link } from '../Link'
import { View, Button, Drawer } from '@/components'
import { Location } from '@reach/router'
import { useMediaQuery } from '@codeleap/web'
import { createStyles } from '@codeleap/styles'

type NavbarProps = {
  pages: [string, MdxMetadata[]][]
  title: string
  location: Location
}

const ArticleLink = ({ title, path, selected, isRoot }) => (
  <Link to={path} style={['noUnderline']}>
    <Button
      text={title}
      onPress={() => null}
      style={['docItem', 'hiddenIcon', selected && 'docItem:selected', !isRoot && 'docItem:list']}
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
    <View style={['column', 'fullWidth', 'gap:0.5']}>
      <Button
        text={name}
        onPress={toggle}
        icon='chevron-right'
        style={['docItem', {
          text: {
            fontWeight: 900
          },
          icon: {
            transform: `rotate(${open ? 90 : 0}deg)`,
          }
        }]}
      />

      <Collapse open={open} height={items.length * 80} style={styles.collapsibleList}>
        {_items}
      </Collapse>
    </View>
  )
}

export const Navbar = ({ pages, location }: NavbarProps) => {
  const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)

  const isMobile = useMediaQuery(theme.media.down('tabletSmall'), { getInitialValueInEffect: false })

  const Items = () => <>
    {pages.map?.(([category, items]) => {
      return <Category items={items} name={category} key={category} location={location} />
    })}
  </>

  return <View style={['column', 'gap:0.5', styles.sidebar]}>
    {isMobile && <Button text='Open navigation' onPress={toggleDrawer} style={['docNavbar']} />}

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

const styles = createStyles((theme) => ({
  sidebar: {
    height: '100%',
    position: 'static',
    minWidth: SECTION_WIDTH,
    maxWidth: SECTION_WIDTH,
    minHeight: '90svh',
    borderRight: `1px solid ${theme.colors.neutral3}`,
    paddingTop: theme.spacing.value(3),

    [theme.media.down('tabletSmall')]: {
      minWidth: '100vw',
      maxWidth: '100vw',
      minHeight: 'unset',
      paddingTop: 0,
    },
  },
  toggleButton: {
    transition: 'transform 0.3s ease',
    position: 'fixed',
    zIndex: 1,
    right: theme.spacing.value(3),
    bottom: theme.spacing.value(3),
  },
  collapsibleList: {
    ...theme.presets.column,
  },
}))
