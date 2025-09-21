import { v4 } from 'uuid'

export const tempIdPrefix = 'temp-id'

export const generateTempId = () => {
  return tempIdPrefix + '-' + v4()
}
