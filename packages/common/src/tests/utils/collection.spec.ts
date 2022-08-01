import { expect } from 'chai'
import { Collection } from '../../utils/Collection'

const items = [
  {
    id: '1',
    value: 1,
  },
  {
    id: '2',
    value: 5,
  },
  {
    id: '3',
    value: 7,
  },
]

const collection = new Collection(items, 'id')

describe('Collection', () => {
  it('Returns items with at correct ids', () => {
    const item = collection.getItem('1')

    expect(JSON.stringify(item)).to.be.eq(JSON.stringify(items[0]))
  })

  it('Returns default when item is not found', () => {
    const item = collection.getItem('abc', 55)

    expect(item).to.be.eq(55)
  })

  it('Sets the item correctly', () => {
    const itemId = '2'

    collection.setItem(itemId, {
      value: 40,
    })

    const newVal = collection.find(i => i.id === itemId)

    expect(newVal.value).to.be.eq(40)
  })

  it('Should return wheter the key exists or not', () => {
    const NonExistant = collection.hasItem('non-existant')
    const existant = collection.hasItem('3')

    expect(NonExistant).to.eq(false)
    expect(existant).to.eq(true)

  })
})

