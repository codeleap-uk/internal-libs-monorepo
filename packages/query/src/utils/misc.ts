function uuidV4() {
  function randomHex() {
    return Math.floor(Math.random() * 16).toString(16);
  }

  let uuid = ''

  for (let i = 0; i < 8; i++) {
    uuid += randomHex()
  }

  uuid += '-'

  for (let i = 0; i < 4; i++) {
    uuid += randomHex()
  }

  uuid += '-'

  uuid += '4';
  for (let i = 0; i < 3; i++) {
    uuid += randomHex()
  }
  uuid += '-'

  uuid += ['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)];
  for (let i = 0; i < 3; i++) {
    uuid += randomHex()
  }
  uuid += '-'

  for (let i = 0; i < 12; i++) {
    uuid += randomHex()
  }

  return uuid
}

export const tempIdPrefix = 'temp-id'

export const generateTempId = () => {
  return tempIdPrefix + '-' + uuidV4()
}
