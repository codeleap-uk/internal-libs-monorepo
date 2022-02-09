
import { optionalObject } from '../../../utils';
import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';


export type AvatarComposition = 'image' | 'text' |'general' | 'editImageBubble' | 'editing' | 'fileInput';

const createAvatarStyle = createDefaultVariantFactory<AvatarComposition>()

const presets = includePresets((styles) => createAvatarStyle(() => ({ general: styles })))

export const AvatarStyles = {
  ...presets,
  default: createAvatarStyle((Theme) => ({
    image: {
      // backgroundColor: Theme.colors.light,
      ...Theme.presets.center,
      ...Theme.semiCircle(140),
      position: 'relative',
      overflow: 'visible',
      ...( Theme.IsBrowser ? {
        objectFit: 'cover', 
        '&:hover': {
          cursor: 'pointer',
        },
        [Theme.media.is('small')]: {
          ...Theme.semiCircle(70),
        },
      }: {}),
      opacity: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
      
    },
    text: {
      fontSize: 26,
    },
    textEdit: {
      color: 'white',
      position: 'absolute',
      fontWeight: 'bold',
      textDecoration: 'underline',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    editImageIcon: {
      ...Theme.presets.center,
      width: 150,
      height: 150,
    },
    wrapper: {
      overflow: 'visible',
      position: 'relative',
    },
    fileInput: {
      display: 'none',
    },
    editing: {
      backgroundColor: Theme.colors.black,
      width: '100%',
      height: '100%',
      // borderRadius: '50%',
      position: 'absolute',
      zIndex: 9,
      opacity: 0.3,
    },
  })),
  large: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.semiCircle(200),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.semiCircle(80),
      }}, {}),
    },
    text: {
      fontSize: 150,
      lineHeight: 160,
    },
  })),
  medium: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.semiCircle(100),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.semiCircle(60),
      }}, {}),
    },
    text: {
      fontSize: 60,
      lineHeight: 50,
    },
  })),
  banner: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.semiCircle(60),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.semiCircle(40),
      }}, {}),
    },
    text: {
      fontSize: 24,
      alignItems: 'center',
      justifyContent: 'center',
      // height: '100%',
    },
  })),
  small: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.semiCircle(40),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.semiCircle(30),
      }}, {}),
    },
    text: {
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
      // height: '100%',
    },
  })),
  verySmall: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.semiCircle(16),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.semiCircle(14),
      }}, {}),
    },
    text: {
      fontSize: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })),
  largeCircle: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.circle(100),
      ...optionalObject(Theme.IsBrowser, {[Theme.media.is('small')]: {
        ...Theme.circle(60),
      }}, {}),
    },
  })),
  midCircle: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.circle(40),
      ...optionalObject(Theme.IsBrowser, {
        [Theme.media.is('small')]: {
          ...Theme.circle(30),
        },
      }, {}),
    },
  })),
  smallCircle: createAvatarStyle((Theme) => ({
    image: {
      ...Theme.circle(30),
      ...optionalObject(Theme.IsBrowser, {
        [Theme.media.is('small')]: {
          ...Theme.circle(30),
        },
      }, {}),
    },
  })),
  borders: createAvatarStyle((Theme) => ({
    image: {
      border: Theme.border.black(1),
    },
  })),
  disabled: createAvatarStyle((Theme) => ({
    general: {
      pointerEvents: 'none',
    },
  })),
}
