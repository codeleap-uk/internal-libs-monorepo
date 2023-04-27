
import path from 'path'
import { cwd } from '../constants'
import { logger } from './log'

// let _firebaseApp:firebase.app.App = null

// if (!_firebaseApp) {
//   try {
//     _firebaseApp = firebase.initializeApp({
//       credential: firebase.credential.cert(
//         path.join(cwd, 'firebase_admin.json'),
//       ),
//     })

//   } catch (e) {

//   }
// }

export async function getFirebaseAdmin(credentialPath = path.join(cwd, 'firebase_admin.json')) {
  const firebase = await import('firebase-admin')
  if(!firebase.apps.length){
    logger.verbose('Initializing firebase admin')
    firebase.initializeApp({
      credential: firebase.credential.cert(
        credentialPath,
        ),
    })
    logger.verbose('Firebase admin initialized')
  }
  logger.verbose('Firebase admin instance keys', Object.keys(firebase))
  return firebase
}

// export const firebaseApp = _firebaseApp
