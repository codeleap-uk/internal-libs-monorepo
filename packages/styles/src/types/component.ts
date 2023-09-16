import { AnyRecord, IJSX } from './core'
import { StyleProp, VariantStyleSheet } from './style'

export type PropsWithVariants<Props extends AnyRecord, VariantStyles extends AnyRecord> = Omit<Props, 'style'> & {
  style?: StyleProp<
    Extract<keyof Props, 'style'> extends never ? VariantStyles[keyof VariantStyles] : (
      Props['style'] extends StyleProp<infer C> ? C : VariantStyles[keyof VariantStyles]
    ),
    keyof VariantStyles
  >
}

export type AnyFunction = (...args: any[]) => any

export type StyledComponentProps<Props extends AnyRecord, VariantStyles> = PropsWithVariants<Props, VariantStyles>

export type StyledComponent<VariantStyles, Props extends AnyRecord = AnyRecord> = (
  (props: StyledComponentProps<Props, VariantStyles>) => IJSX
) & {
  styleRegistryName?: string
  elements?: string[]
  rootElement?: string
}

export type GenericStyledComponentAttributes<Props> = {
  styleRegistryName?: string
  withVariantTypes?: <VariantStyles extends VariantStyleSheet>(variants: VariantStyles) => StyledComponent<VariantStyles, Props>
  elements?: string[]
  rootElement?: string
}

export type GenericStyledComponent<
  Props extends AnyRecord
> = ((props: Props) => IJSX) & GenericStyledComponentAttributes<Props>

export type AnyStyledComponent = GenericStyledComponent<any>
