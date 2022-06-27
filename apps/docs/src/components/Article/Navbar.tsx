import { React, Text, View, Button, variantProvider, Theme, Drawer } from '@/app'
import { Collapse } from '../Collapse'
import { MdxMetadata } from 'types/mdx'
import { useBooleanToggle, useComponentStyle } from '@codeleap/common'
import { Link } from '../Link'

type NavbarProps = {
  pages: Record<string, MdxMetadata[]>
  title: string
}
const ArticleLink = ({ title, path }) => <Link text={title} to={path} variants={['padding:1']}/>
const Category = ({ name, items }) => {
  const [open, toggle] = useBooleanToggle(false)
  return <View variants={['column', 'fullWidth']}>
    <Button text={name} onPress={toggle} rightIcon='arrowDownWhite' variants={['categoryButton']} styles={{
      rightIcon: {
        transform: `rotate(${open ? 180 : 0}deg)`,
      },
    }}/>
    <Collapse open={open} height={items.length * 80} css={staticStyles.collapsibleList}>
      {items.map((p, idx) => <ArticleLink title={p.title} key={idx} path={`/${p.module}/${p.path}`} />)}
    </Collapse>
  </View>
}

export const Navbar:React.FC<NavbarProps> = ({ pages, title }) => {
  const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)

  const styles = useComponentStyle(componentStyles)

  const isMobile = Theme.hooks.down('mid')

  const WrapperComponent = isMobile ? Drawer : View

  return <>
    <Button variants={['circle']} icon='chevronLeft' styles={{
      icon: {
        transform: `rotate(${isDrawerOpen ? 0 : 180}deg)`,
        transition: 'transform 0.3s ease',
      },
      wrapper: {
        ...styles.toggleButton,
        transform: isMobile ? `scale(${isDrawerOpen ? 0 : 1})` : 'scale(0)',
      },
    }} onPress={toggleDrawer}/>
    <WrapperComponent
      css={styles.wrapper}
      open={isDrawerOpen}
      position='left'
      toggle={toggleDrawer}
      size='50%'
    >
      <Text variants={['h4', 'alignSelfCenter', 'marginVertical:2']} text={title} responsiveVariants={{ small: ['h3'] }}/>
      {
        pages?._root_?.map?.(item => <ArticleLink title={item.title} path={item.path} key={item.path}/>)
      }

      {
        Object.entries(pages)
          .map(([category, items]) => category !== '_root_' ? (

            <Category name={category} key={category} items={items} />
          ) : null)
      }
    </WrapperComponent>
  </>
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    position: 'sticky',
    left: 0,
    bottom: 0,
    top: theme.values.headerHeight,
    maxHeight: theme.values.height - theme.values.headerHeight,
    overflowY: 'hidden',
    backgroundColor: theme.colors.background,
    ...theme.presets.column,
    ...theme.presets.alignSelfStretch,
    ...theme.border.grayFade({
      width: 1,
      directions: ['right'],
    }),
    // width: 240,
    // minWidth: 240,
    flexBasis: '30%',

  },

  toggleButton: {
    transition: 'transform 0.3s ease',
    ...theme.presets.fixed,
    zIndex: 1,
    right: theme.spacing.value(3),
    bottom: theme.spacing.value(3),
  },
}))

const staticStyles = variantProvider.createComponentStyle((theme) => ({
  collapsibleList: {
    ...theme.spacing.paddingLeft(2),
    ...theme.presets.alignStretch,
    ...theme.presets.column,
  },
}), true)
