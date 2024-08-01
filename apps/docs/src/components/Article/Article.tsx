import { React } from '@/app'
import { PhotoProvider } from 'react-photo-view'
import { Text, View, Link } from '@/components'
import { capitalize } from '@codeleap/common'
import { createStyles } from '@codeleap/styles'

export const Article = ({ children, title = '', source = '', description = '', lib = '', tag = '' }) => {
  return (
    <PhotoProvider>
      <View style={styles.wrapper}>
        <View style={['column', 'padding:4', 'gap:1', 'backgroundColor:neutral2']}>
          <View style={['row', 'center', 'justifyStart', 'gap:2']}>
            <Text style={['h1', 'bold']} text={title} />
            {!!tag && (
              <View style={['paddingHorizontal:2', 'paddingVertical:0.5', 'backgroundColor:primary1', 'borderRadius:rounded', 'h:auto']}>
                <Text style={['p4', 'bold', 'color:primary3']} text={capitalize(tag)} />
              </View>
            )}
          </View>
          {!!description && <Text style={['p2', 'color:neutral7']} text={description} />}

          {(!!source || lib?.includes('@/')) && (
            <View style={['column', 'marginTop:3', 'gap:2']}>
              {!!source && (
                <View style={['gap:4']}>
                  <Text style={['p3', 'color:primary3']} text={'Source'} />
                  <Link to={source} style={['noUnderline']} target='_blank'>
                    <Text style={['p3', 'color:neutral10']} text={'View source code'} />
                  </Link>
                </View>
              )}

              {lib?.includes('@') && (
                <View style={['gap:4']}>
                  <Text style={['p3', 'color:primary3']} text={'Package'} />
                  <Text style={['p3', 'color:neutral10']} text={lib} />
                </View>
              )}
            </View>
          )}
        </View>

        <View style={['column', 'flex', 'alignStart', 'gap:2', 'paddingHorizontal:3', 'paddingTop:2']}>
          {children}
        </View>
      </View>
    </PhotoProvider>
  )
}

const styles = createStyles((theme) => ({
  wrapper: {
    flex: 1,
    ...theme.presets.column,
    minHeight: '80svh'
  },
}))
