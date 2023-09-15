import { React, variantProvider } from '@/app'
import { PhotoProvider } from 'react-photo-view'
import { Text, View } from '@/components'

export const Article = ({ children, title = '' }) => {
  return (
    <PhotoProvider>
      <View 
        variants={['column', 'flex', 'paddingLeft:3', 'paddingRight:3', 'alignStart', 'gap:2']} 
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
  },
}), true)
