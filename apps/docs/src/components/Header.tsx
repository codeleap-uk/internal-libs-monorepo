import { React, View, Text, Theme, logger, Button, variantProvider, variants } from '@/app'
import { Logo } from '@/components'

export function Header(props) {
  const { title, variants } = props
  

  let content = (
    <View variants={['row', 'marginLeft:2', 'fullWidth', 'alignCenter']}>
      <Text variants={[`p1`, 'primary']} text={title}/> 
    </View>
  )
  if (variants?.includes('logo')) {
    content = (
      <Logo variants='black' style={styles.logo}></Logo>
    )
  }
  return (
    <View style={styles.wrapper}>
      {content}
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    borderBottomColor: Theme.colors.borders,
    borderBottomWidth: 1,
    height: Theme.values.headerHeight,
  },
  logo: {
    width: '40%',
    flex: 1,
    ...Theme.spacing.margin(1),
  },
}, true)
