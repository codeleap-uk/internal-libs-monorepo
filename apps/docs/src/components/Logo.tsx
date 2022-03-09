import { Theme, React, variantProvider, Touchable, Settings } from '@/app'
import { onUpdate, useCodeleapContext, useState } from '@codeleap/common'
import { Session } from '@/redux'
import { Image } from './Image'
type LogoProps = {
  variants?: string | string[]
  switchServerOnPress?: boolean
  style?: {}
}

export function Logo(props: LogoProps) {
  const {
    style,
    switchServerOnPress,

  } = props
  const { currentTheme } = useCodeleapContext()

  const source = (props.variants?.includes('black') || (currentTheme === 'light' && !props.variants)) ? 'codeleap_logo_black.png' : 'codeleap_logo_white.png'

  const [numberOfPresses, setPresses] = useState(0)

  onUpdate(() => {
    if (numberOfPresses === 10) {
      Session.setMode().then(() => {
        setPresses(0)
      })
    }
  }, [numberOfPresses])

  const image = <Image
    source={source}
    css={[styles.image, style]}
    {...props}
  />

  if (switchServerOnPress && Settings.Environment.IsDev) {
    return <Touchable onPress={() => setPresses(n => n + 1) }
      debugName={'Click on Logo'}>
      {image}
    </Touchable>
  }

  return image
}

const styles = variantProvider.createComponentStyle({
  image: {
    height: undefined,
    width: '75%',
    alignSelf: 'center',
  },
}, true)
