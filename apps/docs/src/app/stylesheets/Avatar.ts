import { variantProvider } from '../theme'
// import { AvatarComposition } from '@codeleap/common'

// const createAvatarStyle = variantProvider.createVariantFactory<AvatarComposition>()

const defaults = variantProvider.getDefaultVariants('Avatar')

export const AvatarStyles = {
  ...defaults,
  // default: createAvatarStyle((theme) => ({
  //   ...defaults.default,
  //   wrapper: {
  //     ...defaults.default.wrapper,
  //   },
  //   general: {
  //     ...defaults.default.general,
  //   },
  //   editing: {
  //     ...defaults.default.editing,
  //   },
  //   textEdit: {
  //     ...defaults.default.textEdit,
  //   },
  //   image: {
  //     ...defaults.default.image,
  //   },
  // })),
  // large: createAvatarStyle((theme) => ({
  //   ...defaults.large,
  //   general: {
  //     ...defaults.large.general,
  //   },
  //   image: {
  //     ...defaults.large.image,
  //   },
  // })),
}
