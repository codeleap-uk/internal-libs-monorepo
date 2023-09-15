import { React, variantProvider } from '@/app'
import { PhotoProvider } from 'react-photo-view'
import { Text, View, Link } from '@/components'
import { capitalize } from '@codeleap/common'

export const Article = ({ children, title = '', source = '', description = '', lib = '', tag = '' }) => {
  return (
    <PhotoProvider>
      <View css={styles.wrapper}>
        <View variants={['column', 'padding:4', 'gap:1', 'backgroundColor:body']}>
          <View variants={['row', 'center', 'justifyStart', 'gap:2']}>
            <Text variants={['h1', 'bold']} text={title} />
            {!!tag && (
              <View variants={['paddingHorizontal:2', 'paddingVertical:0.5', 'backgroundColor:primary1', 'border-radius:rounded', 'h:auto']}>
                <Text variants={['p4', 'bold', 'color:primary3']} text={capitalize(tag)} />
              </View>
            )}
          </View>
          {!!description && <Text variants={['p2', 'color:neutral7']} text={description} />}

          {(!!source || lib?.includes('@/')) && (
            <View variants={['column', 'marginTop:3', 'gap:2']}>
              {!!source && (
                <View variants={['gap:4']}>
                  <Text variants={['p4', 'color:primary3']} text={'Source'} />
                  <Link to={source} variants={['noUnderline']} target='_blank'>
                    <Text variants={['p4', 'color:neutral10']} text={'View source code'} />
                  </Link>
                </View>
              )}

              {lib?.includes('@') && (
                <View variants={['gap:4']}>
                  <Text variants={['p4', 'color:primary3']} text={'Package'} />
                  <Text variants={['p4', 'color:neutral10']} text={lib} />
                </View>
              )}
            </View>
          )}
        </View>

        <View variants={['column', 'flex', 'alignStart', 'gap:2', 'paddingHorizontal:3', 'paddingTop:2']}>
          {children}
        </View>
      </View>
    </PhotoProvider>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    flex: 1,
    ...theme.presets.column,
    minHeight: '80svh'
  },
}), true)
