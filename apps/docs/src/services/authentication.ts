/* eslint-disable @typescript-eslint/no-namespace */
import fireabaseAuth from 'gatsby-plugin-firebase'
import { api, logger } from '@/app'
import { Profile, TSession } from '@/redux'

const FBErrorProps = ['name', 'namespace', 'code', 'message'] as const
export type FirebaseError = Partial<
  Record<typeof FBErrorProps[number], string>
>

export const firebase = fireabaseAuth.auth
const auth = fireabaseAuth.auth

namespace FirebaseAuthTypes {
  export type User = fireabaseAuth.User
  export type UserCredential = fireabaseAuth.auth.UserCredential
}

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
  google: () => auth().signInWithPopup(new auth.GoogleAuthProvider()),
  facebook: () => auth().signInWithPopup(new auth.FacebookAuthProvider()),
}

export type Providers = keyof typeof CredentialProviders

export const authProvidersList = Object.keys(
  CredentialProviders,
) as Providers[]

export type TrySocialLoginArgs = {
  withProvider?: Providers
}

export type EmailCredential = {
  email: string
  password: string
}

export type TryLoginArgs =
  | TrySocialLoginArgs
  | {
      withProvider?: 'email'
      data?: EmailCredential
    }

export async function trySocialLogin({ withProvider }: TrySocialLoginArgs) {
  const socialCredential = await CredentialProviders[withProvider]()

  return socialCredential
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
  data: Omit<TSession['profile'], 'id'>
  provider?: Providers | 'email'
}

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

export async function reauthenticateCredentials(data: any) {
  return await auth().signInWithEmailAndPassword(data.email, data.password)
}

export async function sendVerificationEmail() {
  auth().currentUser.sendEmailVerification()
}

export async function saveProfile(currentProfile:Profile, newProfile:Partial<Profile>) {
  const isAvatarChanged = currentProfile?.avatar != newProfile?.avatar

  const { data: savedProfile } = await api.patch(
    `profiles/${currentProfile.id}/`,
    { data: { ...currentProfile, ...newProfile }, files: isAvatarChanged && newProfile?.avatar },
    { multipart: true },
  )

  return savedProfile
}

export async function updateEmail(email: string) {
  const user = auth().currentUser

  return await user.updateEmail(email)
}

export async function sendPasswordReset() {
  const userEmail = auth().currentUser.email

  return await auth().sendPasswordResetEmail(userEmail)
}

export async function logout() {
  await auth().signOut()
}
