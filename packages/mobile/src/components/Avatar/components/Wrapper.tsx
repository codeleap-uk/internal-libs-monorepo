import { TypeGuards } from '@codeleap/types'
import { useAvatarContext } from '../context'
import { useMemo } from 'react'
import { matchInitialToColor, memoBy } from '@codeleap/utils'
import { Touchable } from '../../Touchable'
import { View } from '../../View'

const UnMemoizedAvatarWrapper = ({ children }: React.PropsWithChildren) => {
  const { styles, onPress, name, icon, image, ...wrapperProps } = useAvatarContext()

  // @ts-expect-error ICSS
  const bgColor = styles?.touchable?.backgroundColor

  const randomBgColor = useMemo(() => {
    if (!!bgColor) return bgColor

    const firstLetter = TypeGuards.isString(name) ? name[0] : name?.[0]?.[0]

    return matchInitialToColor(firstLetter)
  }, [bgColor, name])

  const isPressable = TypeGuards.isFunction(onPress)

  if (isPressable) {
    return (
      <Touchable
        debugName='avatar'
        {...wrapperProps}
        onPress={onPress}
        style={[styles.wrapper, { backgroundColor: randomBgColor }]}
      >
        {children}
      </Touchable>
    )
  }

  return (
    <View {...wrapperProps} style={[styles.wrapper, { backgroundColor: randomBgColor }]}>
      {children}
    </View>
  )
}

export const AvatarWrapper = memoBy(UnMemoizedAvatarWrapper, 'children')
