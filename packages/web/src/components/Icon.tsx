import {
  ComponentVariants,
  IconPlaceholder,
  useDefaultComponentStyle,
  useCodeleapContext,
  IconStyles,
} from '@codeleap/common'

export type IconProps = {
  name: IconPlaceholder;
  style?: any;
} & ComponentVariants<typeof IconStyles>;

export const Icon: React.FC<IconProps> = ({
  name,
  style,
  responsiveVariants,
  variants,
}) => {
  const { Theme, logger } = useCodeleapContext()
  const Component = Theme?.icons?.[name]

  const variantStyles = useDefaultComponentStyle('Icon', {
    variants,
    responsiveVariants,
  })

  if (!name) return null

  if (!Component) {
    logger.warn(
      'Icon',
      `No icon found in theme for name "${name}"`,
      'Component',
    )
    return null
  }
  return <Component style={{ ...variantStyles.icon, ...style }} />
}
