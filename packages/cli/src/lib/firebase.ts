import firebase from 'firebase-admin'
import path from 'path'
import { cwd } from '.'
export let firebaseApp:firebase.app.App = null

if (!firebaseApp) {
  try {
    firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(
        path.join(cwd, 'firebase_admin.json'),
      ),
    })

  } catch (e) {

  }
}
