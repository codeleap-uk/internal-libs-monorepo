import Cookies from 'js-cookie'

const get = (key) => (
  Cookies.get(key)
)

const set = (key, value) => (
  Cookies.set(key, value, { expires: 365 })
)

const remove = (key) => (
  Cookies.remove(key)
)

export default {
  get,
  set,
  remove,
}
