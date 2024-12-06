const names = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas',
  'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven',
  'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy',
  'Jason', 'Jeffrey', 'Ryan', 'Gary', 'Jacob'
]

const surnames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres',
]

const animals = [
  'lion', 'tiger', 'zebra', 'panda', 'koala', 'bear',
  'wolf', 'fox', 'rabbit', 'bat', 'spider', 'frog', 'shark'
]

function getRandom(list: Array<string>) {
  return list[Math.floor(Math.random() * list.length)]
}

function number(min: number = 0, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const faker = {
  lastName: () => getRandom(surnames),
  firstName: () => getRandom(names),
  animal: () => getRandom(animals),
  number,
  name: () => `${getRandom(names)} ${getRandom(surnames)}`
}
