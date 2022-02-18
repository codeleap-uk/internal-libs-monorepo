import { React, Image, variantProvider, View, Theme } from '@/app'
import logoWhite from '@/images/codeleap_logo_white.png'

export const Splash = () => {
  return (
    <View
      variants={['center', 'full', 'absolute']}
      style={{
        backgroundColor: Theme.colors.black,
      }}
    >
      <Image
        fast
        source={logoWhite}
        resizeMode='contain'
        style={styles.image}
      />
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  image: {
    height: '80%',
    width: '80%',
  },
})

export default Splash
