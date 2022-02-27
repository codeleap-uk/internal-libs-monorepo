import { optionalObject } from '../../../utils'
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type AvatarComposition =
  | 'image'
  | 'text'
  | 'general'
  | 'editImageBubble'
  | 'textEdit'
  | 'editImageIcon'
  | 'wrapper'
  | 'editing'
  | 'fileInput'

const createAvatarStyle = createDefaultVariantFactory<AvatarComposition>()

const presets = includePresets((styles) => createAvatarStyle(() => ({ general: styles })),
)

export const AvatarStyles = {
  ...presets,
  default: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.presets.center,
      ...Theme.semiCircle(140),
      overflow: 'hidden',
      display: 'flex',
      ...(Theme.IsBrowser
        ? {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(70),
          }}
        : {}),

    },
    image: {
      // backgroundColor: Theme.colors.light,
      ...Theme.presets.center,
      position: 'relative',
      ...(Theme.IsBrowser
        ? {
          objectFit: 'cover',
          '&:hover': {
            cursor: 'pointer',
          }}
        : {}),
      opacity: 1,
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 26,
      color: Theme.typography.hColor,
    },
    textEdit: {
      color: 'white',
      ...optionalObject(
        Theme.IsBrowser,
        {
          position: 'absolute',
          fontWeight: 'bold',
          textDecoration: 'underline',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }, {},
      ),
    },
    editImageIcon: {
      ...Theme.presets.center,
      width: 150,
      height: 150,
    },
    wrapper: {
      overflow: 'hidden',
      position: 'relative',
      alignItems: 'center',
    },
    fileInput: {
      display: 'none',
    },
    editing: {
      backgroundColor: Theme.colors.black,
      opacity: 0.4,
      zIndex: 9,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })),
  large: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.semiCircle(200),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(80),
          },
        },
        {},
      ),
    },
    text: {
      fontSize: 150,
      lineHeight: 160,
    },
  })),
  medium: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.semiCircle(100),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(60),
          },
        },
        {},
      ),
    },
    text: {
      fontSize: 60,
      lineHeight: 50,
    },
  })),
  banner: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.semiCircle(60),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(40),
          },
        },
        {},
      ),
    },
    text: {
      fontSize: 24,
      alignItems: 'center',
      justifyContent: 'center',
      // height: '100%',
    },
  })),
  small: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.semiCircle(40),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(30),
          },
        },
        {},
      ),
    },
    text: {
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
      // height: '100%',
    },
  })),
  verySmall: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.semiCircle(16),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.semiCircle(14),
          },
        },
        {},
      ),
    },
    text: {
      fontSize: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })),
  largeCircle: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.circle(100),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.circle(60),
          },
        },
        {},
      ),
    },
  })),
  midCircle: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.circle(40),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.circle(30),
          },
        },
        {},
      ),
    },
  })),
  smallCircle: createAvatarStyle((Theme) => ({
    general: {
      ...Theme.circle(30),
      ...optionalObject(
        Theme.IsBrowser,
        {
          [Theme.media.is('small')]: {
            ...Theme.circle(30),
          },
        },
        {},
      ),
    },
  })),
  borders: createAvatarStyle((Theme) => ({
    general: {
      border: Theme.border.neutral(1),
    },
  })),
  disabled: createAvatarStyle((Theme) => ({
    general: {
      pointerEvents: 'none',
    },
  })),
}
