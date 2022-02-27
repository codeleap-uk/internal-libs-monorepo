import { Theme, Image, React, variantProvider, Touchable, Settings } from '@/app'
import { onUpdate, useState } from '@codeleap/common'
import { Session } from '@/redux'

type LogoProps = {
  variants?: string | string[]
  switchServerOnPress?: boolean
  style?: {}
}

export function Logo(props: LogoProps) {
  const source = props.variants?.includes('black') ? 'codeleap_logo_black.png' : 'codeleap_logo_white.png'

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
    style={[styles.image, props?.style]}
  />

  if (props.switchServerOnPress && Settings.Environment.IsDev) {
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
