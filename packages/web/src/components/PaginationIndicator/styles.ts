import { ActivityIndicatorComposition } from '@codeleap/common'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}` | 'wrapper'

export const PaginationIndicatorStyles = {
//   ...presets,
//   default: createPaginationIndicatorStyle((theme) => {
//     return {
//       wrapper: {
//         ...theme.presets.fullWidth,
//         ...theme.presets.center,
//       },
//       loaderWrapper: {
//         ...theme.presets.center,
//         ...theme.spacing.marginVertical(3),
//       },
//       text: {
//         ...assignTextStyle('h4')(theme).text,
//         ...theme.presets.textCenter,
//         ...theme.spacing.marginVertical(3),
//         ...theme.presets.fullWidth,
//       },
//     }
//   }),
}
