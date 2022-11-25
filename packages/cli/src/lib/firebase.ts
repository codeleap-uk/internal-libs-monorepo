import firebase from 'firebase-admin'
import path from 'path'
import { cwd } from '../constants'

let _firebaseApp:firebase.app.App = null

if (!_firebaseApp) {
  try {
    _firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(
        path.join(cwd, 'firebase_admin.json'),
      ),
    })

  } catch (e) {

  }
}

export async function loadFirebaseAdmin(credentialPath: string) {
  _firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(
      credentialPath,
    ),
  })
}

export const firebaseApp = _firebaseApp
