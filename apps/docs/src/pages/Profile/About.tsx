import { React, View, Text, List, Button, variantProvider, Settings } from '@/app'
import { Theme } from '@/app'
// import { Theme, licenses, timestamp } from '@/app'
import { Header } from '@/components'
import moment from 'moment'
// import crashlytics from '@react-native-firebase/crashlytics'

// NOTE temporary data before we fill this up
const timestamp = new Date()
const licenses = {
  'some-package': {
    'licenses': 'None',
    'repository': 'codeleap.co.uk',
    'licenseUrl': 'codeleap.co.uk',
    'parents': 'CodeLeap Mobile Template',
  },
  'another-package': {
    'licenses': 'None',
    'repository': 'codeleap.co.uk',
    'licenseUrl': 'codeleap.co.uk',
    'parents': 'CodeLeap Mobile Template',
  },
}

const AboutPage = (props) => {
  const { navigation } = props

  const renderItem = (key, value) => {
    const type = 'License type(s): ' + value.licenses
    const repo = 'Online repository: ' + value.repository
    const url = 'License URL: ' + value.licenseUrl
    return (
      <View style={styles.itemWrapper}>
        <Text text={key} variants={['h4']}/>
        <Text text={type} variants={['p2', 'marginTop:1']}/>
        <Text text={repo} variants={['p2', 'marginTop:1']}/>
        <Text text={url} variants={['p2', 'marginTop:1']}/>
      </View>
    )
  }

  const renderHeader = () => {
    const dateString = moment(timestamp).format('MMM Do YYYY')

    const appName = Settings.AppName
    const compName = Settings.CompanyName
    return (
      <View style={[styles.itemWrapper, styles.header]}>
        <Text text={`This app was created by CodeLeap (codeleap.co.uk, victor@codeleap.co.uk) for ${compName}.`} variants={['p2', 'bold', 'marginTop:1']}/>
        <Text text={`Copyright © ${moment().format('YYYY')} ${compName}.`} variants={['p2', 'bold', 'marginTop:1']}/>
        <Text text={`This page was last updated on ${dateString}.`} variants={['p2', 'bold', 'marginTop:1']}/>
        <Text text={'Below is a list of the packages used inr building this application:'} variants={['p2', 'bold', 'marginTop:1']}/>
      </View>
    )
  }

  const renderFooter = () => {

    return (
      <View style={[styles.itemWrapper, styles.lastItem]}>
        <Button
          variants={['outline', 'fullWidth', 'marginTop:2']}
          debugName={'Submit logs'}
          text={'Submit logs'}
          // onPress={() => undefined.fuuuuu()}
          // onPress={() => crashlytics().crash()}
        />
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <Header navigation={navigation} title={'About'}/>
      <List
        ListHeaderComponent={renderHeader}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={Object.keys(licenses)}
        renderItem={({ item }) => renderItem(item, licenses[item])}
        ListFooterComponent={renderFooter}
        separators={true}
      />
    </View>
  )
}

export default AboutPage

const styles = variantProvider.createComponentStyle({
  wrapper: {
    // ...Theme.cardWrapper,
  },
  scroll: {
    height: Theme.values.height,
    maxHeight: Theme.values.height,
  },
  scrollContent: {
    flexGrow: 1,
    // paddingBottom: Theme.values.safeAreaBottom + Theme.values.navBarHeight + Theme.spacing.value(1),
  },
  itemWrapper: {
    marginLeft: Theme.spacing.value(3),
    paddingRight: Theme.spacing.value(3),
    paddingTop: Theme.spacing.value(2),
    paddingBottom: Theme.spacing.value(2),
    // marginBottom: Theme.values.safeAreaBottom,
  },
  header: {
    // borderBottomWidth: Theme.values.pixel,
    borderBottomColor: Theme.colors.borders,
  },
  lastItem: {
    borderTopWidth: 0,
  },
})
