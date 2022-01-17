export function singleLine(text:string) {
  return text?.replace(/\n/g, ' ')
}


export function stringiparse(string) {
  return JSON.parse(JSON.stringify(string))
}


export function capitalize(str:string){
  return str[0].toUpperCase() + str.substring(1)
}

export function isUppercase(char:string){
  return /[A-Z]|[\u0080-\u024F]/.test(char) && char.toUpperCase() === char
}

export function isLowercase(char:string){
  return !isUppercase(char)
}

export function humanizeCamelCase(str:string){
  const characters = []
  let previousCharacter = ''
  str.split('').forEach((char, idx) => {
    if (idx === 0){
      characters.push(char.toUpperCase())
    } else {
      
      if (isUppercase(char) && isLowercase(previousCharacter)){
      
        characters.push(` ${char}`)
      
      } else {
        characters.push(char)
      }
      
    }


    previousCharacter = char
  })

  return characters.join('')
}

export function ellipsis(str:string, maxLen:number){
  if (str.length - 3 > maxLen  ){
    return str.slice(0, maxLen - 3) + '...'
  }

  return str
}
