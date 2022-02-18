import { Theme, Image, React, logger, variantProvider, Touchable } from '@/app'

import { useState } from 'react'
import logoWhite from '@/images/codeleap_logo_white.png'
import logoBlack from '@/images/codeleap_logo_black.png'
import { onUpdate } from '@codeleap/common'
import { Session } from '@/redux'

type LogoProps = {
  variants?: string | string[]
  switchServerOnPress?: boolean
  style?: {}
}

export function Logo(props: LogoProps) {
  const source = props.variants?.includes('black') ? logoBlack : logoWhite

  const [numberOfPresses, setPresses] = useState(0)

  onUpdate(() => {
    if (numberOfPresses === 10){
      Session.setMode().then(() => {
        setPresses(0)
      })
    }
  }, [numberOfPresses])

  const image = <Image
    source={source}
    resizeMode='contain'
    style={[styles.image, props?.style]}
  />

  if (props.switchServerOnPress && __DEV__){
    return <Touchable onPress={() => setPresses(n => n + 1) }>
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
