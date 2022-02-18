import { Theme, Image, React, logger, variantProvider } from '@/app'

type FSBackgroundProps = {
  source: any
  style?: any
}

export function FSBackground(props: FSBackgroundProps) {
  const { source, style } = props
  return (
    <Image
      source={source}
      resizeMode='cover'
      style={[styles.image, style]}
    />
  )
}

const styles = variantProvider.createComponentStyle({
  image: {
    ...Theme.presets.absolute,
    width: Theme.values.width,
    height: Theme.values.height,
  },
})
