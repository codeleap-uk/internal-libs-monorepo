import type Firebase from 'firebase'

type FirebaseInstance = {
  auth: typeof Firebase.auth
}
let initialized = false
export function withFirebase<T extends((f:FirebaseInstance) => any)>(cb:T):Promise<ReturnType<T>> {
  try {
    return import('firebase/app').then(({ default: _ }) => {
      initialized = _.apps.length === 1
      if (!initialized) {
        _.initializeApp({
          apiKey: 'AIzaSyBzvr9bN5M2lgzTLIo07wn3bUmmZnsMhaA',
          authDomain: 'codeleap-project-template.firebaseapp.com',
          databaseURL: 'https://codeleap-project-template.firebaseio.com',
          projectId: 'codeleap-project-template',
          storageBucket: 'codeleap-project-template.appspot.com',
          messagingSenderId: '268760770384',
          appId: '1:268760770384:web:49a825eb74a7b626d1ee55',
        })
        initialized = true
      }

      return cb(_)
    })

  } catch (e) {
    logger.error(e)
  }
}
