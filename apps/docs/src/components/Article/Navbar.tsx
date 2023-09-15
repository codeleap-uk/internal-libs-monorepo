import { React, variantProvider, Theme } from '@/app'
import { Collapse } from '../Collapse'
import { MdxMetadata } from 'types/mdx'
import { useBooleanToggle } from '@codeleap/common'
import { Link } from '../Link'
import { View, Button, Drawer, Text } from '@/components'

type NavbarProps = {
  pages: [string, MdxMetadata[]][]
  title: string
}

const ArticleLink = ({ title, path }) => (
  <Link to={path} variants={['noUnderline']}>
    <Button
      text={title}
      onPress={() => null}
      icon='chevron-right'
      variants={['docItem', 'hiddenIcon']}
    />
  </Link>
)

const Category = ({ name, items }) => {
  const [open, toggle] = useBooleanToggle(false)

  const isRoot = name === 'Root'
  const _items = items.map((p, idx) => <ArticleLink title={p.title} key={idx} path={'/' + p.path} />)

  if (isRoot) {
    return <>
      {_items}
    </>
  }

  return (
    <View variants={['column', 'fullWidth', 'gap:1']}>
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

export const Navbar: React.FC<NavbarProps> = ({ pages, title }) => {
  const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)

  const isMobile = Theme.hooks.down('mid')

  const WrapperComponent = isMobile ? Drawer : View

  const Items = () => (
    <>
      {/* <Text variants={['h4', 'alignSelfCenter', 'marginVertical:2']} text={title} responsiveVariants={{ small: ['h3'] }}/> */}
      {pages.map?.(([category, items]) => {
        return <Category items={items} name={category} key={category} />
      })}
    </>
  )

  return <View variants={['column', 'gap:2']} style={styles.sidebar}>
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
    borderRight: `1px solid ${theme.colors.neutral3}`,
    paddingRight: 24,
  },
  toggleButton: {
    transition: 'transform 0.3s ease',
    ...theme.presets.fixed,
    zIndex: 1,
    right: theme.spacing.value(3),
    bottom: theme.spacing.value(3),
  },
  collapsibleList: {
    paddingLeft: theme.spacing.value(0.5),
    ...theme.presets.column,
  },
}), true)
