import { expect } from 'chai'
import * as Utils from '../utils'


describe('Utils', () => {
  describe('arePropsEqual()', () => {
    it('Says props are equal', () => {
      const result = Utils.arePropsEqual({
        a: 'b',
      }, {
        a: 'b',
      }, {
        check: ['a'],
      })

      expect(result).to.eq(true)
    })

    it('Says props are different', () => {
      const result = Utils.arePropsEqual({
        a: 'c',
      }, {
        a: 'b',
      }, {
        check: ['a'],
      })

      expect(result).to.eq(false)
    })

    it('Says props are equal while ignoring receivedAt', () => {
      const result = Utils.arePropsEqual({
        a: {
          receivedAt: '10pm',
        },
      }, {
        a: {
          receivedAt: '8pm',
        },
      }, {
        check: ['a'],
        excludeKeys: ['receivedAt'],
      })

      expect(result).to.eq(true)
    })
  })


})
