import firebase from '@firebase/app'
import '@firebase/auth'

const config = {
  apiKey: 'AIzaSyBzvr9bN5M2lgzTLIo07wn3bUmmZnsMhaA',
  authDomain: 'codeleap-project-template.firebaseapp.com',
  databaseURL: 'https://codeleap-project-template.firebaseio.com',
  projectId: 'codeleap-project-template',
  storageBucket: 'codeleap-project-template.appspot.com',
  messagingSenderId: '268760770384',
  appId: '1:268760770384:web:49a825eb74a7b626d1ee55',
}

let instance:ReturnType<typeof firebase.initializeApp> = null

export function getFirebase() {
  if (typeof window !== 'undefined') {
    if (instance) return instance
    instance = firebase.initializeApp(config)
    return instance
  }

  return null
}
