import { variantProvider, variants } from '@/app'
import { mapObject } from '@codeleap/common'
import { ShowcaseProps } from '..'
import { beautifyName } from '../utils/variant'

export const allIcons = Object.fromEntries(
  mapObject(variantProvider.theme.icons, ([key]) => [
    beautifyName(key as string),
    key,
  ]),
)
export const iconOptions = {
  None: 'none',
  ...allIcons,
}

export type ShowcasePropsMap = Partial<
  {
    [Property in keyof typeof variants]: Omit<
      ShowcaseProps<typeof variants[Property]>,
      'name'
    >;
  } & Record<'Avatar', ShowcaseProps<any>>
>
