import { Text, variantProvider, View } from '@/app'
import { useComponentStyle } from '@codeleap/common'

export const Article:React.FC = ({ children, title= '' }) => {

  const styles = useComponentStyle(_styles)

  return <View variants={['column', 'flex', 'padding:5', 'alignStart', 'gap:2']} responsiveVariants={{
    mid: ['padding:1'],
  }} css={styles.wrapper}>
    <Text variants={['h1']} text={title} />
    {children}
  </View>
}

const _styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    maxWidth: 700,
    [theme.media.down('large')]: {

      maxWidth: 500,
    },
  },
}))
