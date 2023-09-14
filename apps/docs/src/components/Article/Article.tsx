import { React, variantProvider } from '@/app'
import { PhotoProvider } from 'react-photo-view'
import { Text, View } from '@/components'

export const Article = ({ children, title = '' }) => {
  return (
    <PhotoProvider>
      <View 
        variants={['column', 'flex', 'padding:5', 'alignStart', 'gap:2']} 
        responsiveVariants={{ mid: ['padding:1'] }} 
        css={styles.wrapper}
      >
        <Text variants={['h1']} text={title} />
        {children}
      </View>
    </PhotoProvider>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    maxWidth: 700,
    [theme.media.down('large')]: {

      maxWidth: 500,
    },
  },
}), true)
