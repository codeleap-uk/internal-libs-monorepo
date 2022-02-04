import { ButtonComposition, createDefaultVariantFactory, includePresets, ModalComposition } from '@codeleap/common'


export const backgroundTransition = {
    duration: 200,
    ease: 'easeOut',
    useNativeDriver: false,
} 
  
export const modalTransition = {
    duration: 150,
    ease: 'easeOut',
    useNativeDriver: false,
}
  

export type MobileModalParts = 
  ModalComposition | 
  'innerWrapper' | 
  'innerWrapperScroll' | 
  'title' |
  `closeButton${Capitalize<ButtonComposition>}`
export type MobileModalComposition = MobileModalParts | `${MobileModalParts}:visible` | `${MobileModalParts}:pose:visible` | `${MobileModalParts}:pose`

const createModalStyle = createDefaultVariantFactory<MobileModalComposition>()
    
const presets = includePresets((style ) =>  createModalStyle(() => ({wrapper: style})))

export const MobileModalStyles = {
   ...presets,
   default: createModalStyle((Theme) => ({
     "box:pose": {
        opacity: 0,
        scale: 0.8,
        y:  Theme.values.height * 0.15,
        transition: modalTransition,
     },
     "box:pose:visible": {
        y: Theme.values.height * 0.3,
        opacity: 1,
        scale: 1,
        transition: modalTransition,
     },
     
      wrapper: {
        width: Theme.values?.width,
        height: Theme.values?.height,
        minHeight: Theme.values?.height,
        ...Theme.presets.absolute,
        ...Theme.presets.whole,
        zIndex: 11,
        backgroundColor: Theme.colors.black,
        opacity: 0
      },
      "wrapper:visible": {  
        opacity: 0.5,  
      },
      box: {
        backgroundColor: Theme.colors.white,
        flexDirection: 'column',
        zIndex: 12,     
        ...Theme.spacing.margin(1),
        ...Theme.spacing.padding(1),
        borderRadius: Theme.borderRadius.large,
      },

      innerWrapper: {
        minHeight: Theme.values?.height,
        width: Theme.values?.width,
        ...Theme.presets.absolute,
        ...Theme.presets.whole,
        zIndex: 10
      },
      innerWrapperScroll:{
        ...Theme.presets.whole,
     
        ...Theme.presets.column,
        ...Theme.presets.absolute,
        minHeight: Theme.values?.height,
        width: Theme.values?.width,
      }
   })),
   popup: createModalStyle((Theme) => ({

   }))
}