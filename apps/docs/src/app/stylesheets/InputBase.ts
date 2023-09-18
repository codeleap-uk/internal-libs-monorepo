import { InputBaseComposition, InputBasePresets } from '@codeleap/web'
import { variantProvider } from '../theme'
import { assignTextStyle } from '@codeleap/common'

const createInputBaseStyle =
  variantProvider.createVariantFactory<InputBaseComposition>()

export const AppInputBaseStyles = {
  ...InputBasePresets,
  default: createInputBaseStyle((theme) => ({
    label: {
      ...assignTextStyle('p2')(theme).text,
      color: theme.colors['neutral7'],
      ...theme.spacing.marginBottom(1),
    },
    description: {
      ...assignTextStyle('p4')(theme).text,
      color: theme.colors['neutral7'],
      
      ...theme.spacing.marginBottom(1),
    },
    errorMessage: {
      ...assignTextStyle('p4')(theme).text,
      color: theme.colors['destructive2'],
      ...theme.spacing.marginTop(1),
    }
  }))
}
