import { RequestClient } from '.'

const a = new RequestClient({
  baseURL: 'https://randomuser.me',
  rejectOnCancel: true,
  // What to do when a request to the same URL is in progress
  duplicateBehavior: 'cancelPrevious',
})

async function testFetch() {
  // Makes request with configuration from instanced request client
  const myRequest = a.post('/api?results=1', {
    data: {
      coisa: 'a',
    },
    image: {
      uri: 'asdasd',
    },
  }, {
    multipart: {
      keyTransforms: {
        data: 'json',
        image: 'file',
      },
    },
  })

  // Handling success/failure
  myRequest.then((res) => {
    console.log(res.data)
  }).catch((stuff) => {
    console.log('Aborted', stuff)
  })

  myRequest.abort()

  // Aborts request, just an extension of Promise
  // myRequest.abort()

}

testFetch()
