import { Settings } from '../app/Settings'
import { LoggerAnalytics } from '@codeleap/common'

export const AppAnalytics = new LoggerAnalytics.Analytics({
  init: () => {
    // analytics().setAnalyticsCollectionEnabled(true).then(() => {
    //   analytics().logAppOpen()
    // })
  },
  onEvent: (eventArgs) => {
    // analytics().logEvent('app_action', eventArgs).then(console.log)
    //   .catch(console.error)
  },
  prepareData: () => {
    const extraData = {
      permissions: 'given',
    }
    // const storeState = store ?  store.getState() : null
    // if (storeState?.Session?.isLoggedIn){
    //   extraData.user = storeState.Session.profile.id
    // } else {
    //   extraData.user = profileFromUser( firebase().currentUser).id
    // }

    return extraData
  },
  onInteraction: (eventArgs) => {

    // analytics().logEvent('user_interaction', eventArgs).then(console.log)
    //   .catch(console.error)
  },
}, Settings)
