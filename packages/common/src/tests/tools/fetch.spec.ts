import { expect } from 'chai'
import { RequestClient } from '../../tools/Fetch/RequestClient'

// global.FormData = URLSearchParams
const api = new RequestClient({
  baseURL: 'https://randomuser.me',
  rejectOnCancel: true,
  duplicateBehavior: 'maintainPrevious',
})

describe('RequestClient', () => {
  it('Fetches a user', async () => {
    const branch = api.branch({
      baseURL: '/api',
    })

    api.setConfig({
      baseURL: 'https://codeleap.co.uk',
    })

    console.log(api.config.baseURL, branch.config.baseURL)

    expect(branch.config.baseURL).eq(api.config.baseURL + '/api')

    api.setConfig({
      baseURL: 'https://randomuser.me',
    })

    console.log(api.config.baseURL, branch.config.baseURL)

    expect(branch.config.baseURL).eq(api.config.baseURL + '/api')
  })

})
