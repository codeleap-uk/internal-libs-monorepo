import { React, View, Text, Theme, variantProvider, Icon, Button, MyComponent } from '@/app'

function Playground(props) {
  return (
    <View style={styles.wrapper}>
      {/* <View variants={['center']}> */}
      <Text text={'Playground'} variants={['h1']}/>
      <Text text={'Use this to test new stuff!'} variants={['p1', 'marginVertical:2']}/>
      <Icon name={'playground'} style={styles.icon}/>
      {/* Navigate to nested screen */}
      {/* <Button onPress={() => props.navigation.navigate('Profile.Edit')} text={'Edit your profile'}/> */}
      {/* </View> */}
      {/* <MyComponent variants={['abc']} /> */}
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    ...Theme.presets.center,
    ...Theme.presets.full,
  },
  icon: {
    size: 100,

  },
})

export default Playground
