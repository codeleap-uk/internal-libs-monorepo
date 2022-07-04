import { variantProvider, View } from '@/app'
import { useComponentStyle } from '@codeleap/common'

export const Article:React.FC = ({ children }) => {

  const styles = useComponentStyle(_styles)

  return <View variants={['column', 'flex', 'padding:5', 'alignStart', 'gap:2']} responsiveVariants={{
    mid: ['padding:1'],
  }} css={styles.wrapper}>
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
