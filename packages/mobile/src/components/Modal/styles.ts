import { createDefaultVariantFactory, includePresets, ModalComposition, ModalStyles } from '@codeleap/common'


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
| 'wrapper' 
| 'overlay' 
| 'innerWrapper' 
| 'innerWrapperScroll' 
| 'box' 
| 'footer' 
| 'body' 
| 'header'
| 'touchableBackdrop'
| 'box:pose'

export type MobileModalComposition = MobileModalParts | `${MobileModalParts}:visible`

const createModalStyle = createDefaultVariantFactory<MobileModalComposition>()
    
const presets = includePresets((style ) =>  createModalStyle(() => ({wrapper: style})))

const defaultModalStyles = ModalStyles

export const MobileModalStyles = {
   ...presets,
   ...defaultModalStyles,
   default: createModalStyle((Theme) => {

    const fullSize = {
      ...Theme.presets.whole,
      position: 'absolute',
      width: Theme?.values?.width,
      height: Theme?.values?.height,
    }

    const a =  {
      wrapper: {
        zIndex:1,

        ...fullSize
      },
      
      overlay: {
        opacity: 0,
        zIndex: 2,
        
        backgroundColor: Theme.colors.black,
        ...fullSize
      },
      "overlay:visible": {
        opacity: 0.5
      },
      innerWrapper: {
        ...fullSize,
        zIndex: 3,
       },
      innerWrapperScroll: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
     
      
        ...fullSize,
        zIndex: 3
      },
      box: {
        width: '80%',
        backgroundColor: Theme.colors.white,
        zIndex: 10,
        borderRadius: Theme.borderRadius.medium,
        ...Theme.spacing.padding(1)
      
      },
      touchableBackdrop: {
        ...fullSize,
    
        zIndex:5
      },
      "box:pose": {
        opacity: 0,
        scale: 0.8,
        y: Theme.values.height * 0.15,
        transition: modalTransition,
      },
      "box:pose:visible": {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: modalTransition,
      },
     
    }
    // console.log('aaaaaaaaaaa',JSON.stringify(a,null,3))
    return a


   }),
   popup: createModalStyle((Theme) => ({

   }))
}