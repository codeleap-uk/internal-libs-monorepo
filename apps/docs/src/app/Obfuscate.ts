import { Matcher } from '@codeleap/common'

const keys:Matcher<'key'>[] = [
  'email',
  'first_name',
  'last_name',
  'name',
  'avatar',
  'password',
]

const values:Matcher<'value'>[] = [
  /Cacetinho/,
]

export default {
  keys,
  values,
}
