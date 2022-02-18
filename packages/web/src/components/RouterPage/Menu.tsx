import { View } from '../View'
import { CenterWrapper } from '../CenterWrapper'
import { HorizontalScroll } from '../HorizontalScroll'
import { MenuItem, MenuItemProps } from './MenuItem'
import { useCodeleapContext, MenuComposition } from '@codeleap/common'
import { StylesOf } from '../../types/utility'

const TabsWrapper = ({ children, styles }) => {
  const { Theme } = useCodeleapContext()
  const isMobile = Theme.hooks.down('small')

  const wrapperStyle = isMobile ? styles.topMenu : styles.sideMenu

  if (isMobile) {
    return (
      <View css={[wrapperStyle]}>
        <CenterWrapper>
          <View css={styles.mobileMenu}>
            <HorizontalScroll css={styles.horizontalScroll}>
              {children}
            </HorizontalScroll>
          </View>
        </CenterWrapper>
      </View>
    )
  }

  return <View css={[wrapperStyle]}>{children}</View>
}

type RouterMenuProps = {
  items: MenuItemProps['data'][];
  styles?: StylesOf<MenuComposition>;
};

export const Menu: React.FC<RouterMenuProps> = ({ items, styles }) => {
  return (
    <TabsWrapper styles={styles}>
      {items.map((data) => (
        <MenuItem data={data} key={data.path} styles={styles} />
      ))}
    </TabsWrapper>
  )
}
