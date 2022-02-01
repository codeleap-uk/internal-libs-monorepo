import { createDefaultVariantFactory } from '@codeleap/common'

export type WebSelectParts = 
    'wrapper' |
    'label' |
    'inputWrapper' | 
    'list' | 
    'itemWrapper' |
    'itemWrapper:selected' |
    'itemText' |
    'itemText:selected' |
    'buttonWrapper' |
    'buttonText' |
    'buttonIcon'|
    'error'

export type WebSelectComposition = 
    `${WebSelectParts}:hover` | 
    `${WebSelectParts}:open` |
    `${WebSelectParts}:error` |
    `${WebSelectParts}:disabled` |
    WebSelectParts 

const createSelectStyle = createDefaultVariantFactory<WebSelectComposition>()


export const WebSelectStyles = {
  default: createSelectStyle((Theme) => ({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      ...Theme.spacing.marginBottom(1),
    },
    inputWrapper: {
      position: 'relative',

    },
      
    list: {
      position: 'absolute',
      left: 0,
      right: 0,
      display: 'flex',
      top: '110%',
      backgroundColor: Theme.colors.gray,

      ...Theme.presets.column,
      overflowY: 'hidden',
     
      transition: 'all 0.5s ease',
      maxHeight: 0,
      ...Theme.border.create({
        width: 0,
        color: 'transparent',
      }),
      borderRadius: Theme.borderRadius.small,
    },
    'list:open': {
      maxHeight: '500%',
      overflowY: 'auto',
      ...Theme.border.primary(1),
       
    },
    itemText: {
    
    },
    itemWrapper: {
      ...Theme.spacing.padding(0.5),
      cursor: 'pointer',
      display: 'flex',
    },
    'itemText:selected': {
    
    },
    'itemWrapper:selected': {
    
    },
    buttonWrapper: {
      ...Theme.border.primary(1),
      ...Theme.presets.fullWidth,
      ...Theme.presets.alignCenter,
      ...Theme.spacing.padding(0.5),
      backgroundColor: Theme.colors.gray,
      borderRadius: Theme.borderRadius.small,
      cursor: 'pointer',
      display: 'flex',
        
    },
    'button:open': {
       
    },
    buttonText: {
      flex: 1,
    },
    buttonIcon: {
      height: 24,
      width: 24,
      color: Theme.colors.white,
      transition: 'all 0.2s ease',
    },
    'buttonIcon:open': {
      transform: 'rotate(180deg)',
    },
    error: {
      color: Theme.colors.negative,
    },
  })),
  
}
  
