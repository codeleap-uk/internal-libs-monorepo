import { FunctionType } from '@codeleap/common';
import { createSpinner, Options } from 'nanospinner';

type SpinWhileNotCompletedOpts = Options & {
    name: string
}

export async function spinWhileNotCompleted(operation:FunctionType<[], Promise<any>>, opts:SpinWhileNotCompletedOpts){
  const {name, ...others} = opts
  
  const spinner = createSpinner(name, others)

  spinner.start()

   
  const result = await operation()

  spinner.success()
    
  return result
}
