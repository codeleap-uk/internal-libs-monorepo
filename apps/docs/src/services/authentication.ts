import firebase, { FirebaseAuthTypes } from 'gatsby-plugin-firebase'

import { api, logger } from '@/app'

import { Profile, TSession } from '@/redux'


const FBErrorProps = ['name', 'namespace', 'code', 'message'] as const
export type FirebaseError = Partial<
  Record<typeof FBErrorProps[number], string>
>;

export {
  firebase,
}

const auth = firebase.auth

export function isFirebaseError(err) {
  try {
    const FBError =
      !!err?.code && !!err?.message && !!err.name && !!err.namespace

    if (FBError) {
      return {
        ...err,
        message: err.message.trim().split(']').slice(1)
          .join(''),
      } as FirebaseError
    }
  } catch (e) {}
  return false
}

const SCOPE = 'Authentication'

export const CredentialProviders = {
  'google': {
    provider: firebase.auth.GoogleAuthProvider,
    getErrorMessage(error){

    },
  },
  'facebook': {
    provider: firebase.auth.FacebookAuthProvider,
    getErrorMessage(reason){
      if (reason?.code?.includes('auth/account-exists-with-different-credential')){
        return 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.'
      }

      return null
    },
  },
}

export type Providers = keyof typeof CredentialProviders;

export const authProvidersList = Object.keys(
  CredentialProviders,
) as Providers[]

export type TrySocialLoginArgs = {
  withProvider?: Providers;
};

export type EmailCredential = {
  email: string;
  password: string;
};

export type TryLoginArgs =
  | TrySocialLoginArgs
  | {
      withProvider?: 'email';
      data?: EmailCredential;
    };

export async function trySocialLogin({ withProvider }: TrySocialLoginArgs) {
  const socialCredential = new CredentialProviders[withProvider].provider()

  const userCredential = await auth().signInWithCredential(socialCredential)

  return userCredential
}

export async function loadOwnProfile(): Promise<TSession['profile']> {
  try {
    const { data: profile } = await api.get('profiles/i/', { silent: true })
    logger.log('Api returned profile', profile, SCOPE)
    return profile
  } catch (err) {
    logger.log('Failed to get profile from API', err, SCOPE)
    return null
  }
}

export function profileFromUser(
  credential: FirebaseAuthTypes.User,
): TSession['profile'] {
  if (!credential) return credential as null

  return {
    id: credential.uid,
    avatar: credential.photoURL,
    email: credential.email,
    first_name: credential.displayName,
    last_name: '',
  }
}

export async function tryLogin(
  args?: TryLoginArgs,
  silent?: boolean,
): Promise<TSession['profile']> {
  if (args) {
    try {
      let credential: FirebaseAuthTypes.UserCredential = null

      switch (args.withProvider) {
        case 'email':
          const { email, password } = args?.data || {}

          // for some reason firebase crashes the app when credentials are empty, so we give it an 'a'
          credential = await auth().signInWithEmailAndPassword(
            email || 'a',
            password || 'a',
          )

          break
        default:
          credential = await trySocialLogin(args)
          break
      }

      return profileFromUser(credential.user)
    } catch (err) {
      if (!silent) {
        const FBError = isFirebaseError(err)
        if (FBError) {
          logger.error(
            `Firebase error on signIn ${FBError.code} ->`,
            FBError.message,
            SCOPE,
          )

        } else {
          logger.error(
            `Error signing in with ${args.withProvider}`,
            err,
            SCOPE,
          )

      
        }
      }

      return null
    }
  }
}

export type TrySignupArgs = {
  data: Omit<TSession['profile'], 'id'>;
  provider?: Providers | 'email';
};

export async function trySignup({ data, provider }: TrySignupArgs) {
  const currentUser = auth().currentUser

  let user = null

  if (currentUser && provider !== 'email') {
    const userHasChangedEmail = currentUser.email !== data.email

    if (userHasChangedEmail) {
      await currentUser.updateEmail(data.email)
    }

    currentUser.updatePassword(data.password)

    user = profileFromUser(currentUser)
  } else {
    const newUser = await auth().createUserWithEmailAndPassword(
      data.email,
      data.password,
    )

    user = newUser.user
  }

  const id = user.uid
  
  try {
    const { data: profile } = await api.post(
      `profiles/create/`,
      { data: { id, ...data }, files: data.avatar },
      { multipart: true },
    )
    await sendVerificationEmail()
    return profile
  } catch (e) {
    logger.error('Signup error', e, SCOPE)
    return null
  }
}

export async function sendVerificationEmail(){
  auth().currentUser.sendEmailVerification()
}

export async function updateProfile(currentProfile:Profile, newProfile:Partial<Profile>){

  const {data: updatedProfile }= await api.patch(
    `profiles/${currentProfile.id}/`, 
    {data: {...currentProfile, ...newProfile}, files: newProfile?.avatar}, 
    { multipart: true },
  )

  if (currentProfile.email !== updatedProfile.email){
    await auth().currentUser.updateEmail(updatedProfile.email)
    await auth().currentUser.sendEmailVerification()

  }
  if (updatedProfile.password){
    auth().currentUser.updatePassword(updatedProfile.password)
  }

  return updatedProfile as Profile

}

export async function sendPasswordReset(email:string){
  await auth().sendPasswordResetEmail(email)
}
export async function logout() {
  await auth().signOut()
}
