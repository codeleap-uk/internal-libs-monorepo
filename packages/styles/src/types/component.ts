import { StyleProp, VariantStyleSheet } from './style'

type PropsWithVariants<Props, VariantStyles, Composition> = Omit<Props, 'style'> & {
  style?: StyleProp<Composition, keyof VariantStyles>
}

export type AnyFunction = (...args: any[]) => any

export type StyledComponentProps<Props, VariantStyles, Composition> = PropsWithVariants<Props, VariantStyles, Composition>

export type GenericStyledComponent<T extends AnyFunction, Composition> = T & {
  styleRegistryName?: string
  withVariantTypes?: <VariantStyles extends VariantStyleSheet>(variants: VariantStyles) => (
    (props: StyledComponentProps<Parameters<T>[0], VariantStyles, Composition>) => ReturnType<T>
  )
  elements?: string[]
  rootElement?: string
}

export type AnyStyledComponent = GenericStyledComponent<AnyFunction, any>
