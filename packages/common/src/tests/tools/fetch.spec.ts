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
    const response = await api.get('/api?results=1')
    expect(response.data.results).to.be.an('array')
  })

  it('Aborts the request', (done) => {
    const req = api.get('/api?results=1')
    req
      .then((response) => {
        console.log(response.statusText)
        done()
      })
      .catch(({ failedRequest }) => {
        console.log('aaaaaaaaaa', failedRequest)
        expect(failedRequest.errorReason).to.eq('REQUEST_ABORTED')
        done()
      })

    req.abort()

  })

  it('Blocks repeated request', (done) => {
    api.get('/api?results=1')
    const req2 = api.get('/api?results=1')

    req2
      .then((res) => {
        console.log('then', res.data)
        done()
      })
      .catch((err) => {
        expect(err.errorReason).to.eq('ALREADY_IN_PROGRESS')
        done()
      })
  })

  it('makes a multipart request', (done) => {
    api.post('https://dev.codeleap.co.uk/profiles/create/', { data: {

    }, files: null }, {
      baseURL: '',
      multipart: true,
    }).then((a) => {
      console.log(a)
    }).catch(a => {
      console.log(a)
    })

  })
})
