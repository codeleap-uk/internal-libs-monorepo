import { createSpinner } from 'nanospinner'

type SpinWhileNotCompletedOpts = Parameters<typeof createSpinner>[1] & {
  name: string
}

export async function spinWhileNotCompleted(
  operation: () => Promise<any>,
  opts: SpinWhileNotCompletedOpts,
) {
  const { name, ...others } = opts

  const spinner = createSpinner(`${name}\n`, others)

  spinner.start()
  try {

    const result = await operation()
    spinner.success()

    return result
  } catch (e) {
    spinner.error()
    console.error(e)
  }

}
