import { waitFor } from '@codeleap/utils'

export const randomId = () => {
  return Math.random().toString(36).slice(2, 9)
}

export async function awaitTransition(count?: number, duration = 1000) {
  for (let i = 0; i < (count ?? 1); i++) {
    await waitFor(duration)
  }

}
