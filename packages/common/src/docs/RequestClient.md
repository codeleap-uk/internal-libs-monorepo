RequestClient class is an extension of Axios which adds:

- Request queueing
- Avoids duplicated requests from being made
- Adds request abortion API
- Easy multipart configuration
---
```typescript
import {RequestClient} from 'codeleap-common'

const api = new RequestClient({
    baseURL: 'your-api-url',
    rejectOnCancel: true, // wheter to throw an error when requests are aborted
    duplicateBehavior: 'maintainPrevious' // How to handle concurrent requests to the same URL
})

async function getSomething(){
    const response = await api.get('/something',{
      // you may pass RequestClientConfig for this request here
    })

    return response.data // data is the response body
}

async function postSomething(){
    const response = await api.post('/something', {
        request_body: 'here'
    }, {
      // you may pass RequestClientConfig for this request here
    })


    return response.data // data is the response body
}
```

#### Abort Request

The abort method is injected onto the promise object from axios, simply call it to cancel the request.

Alternatively, use the RequestClient instance's abort method passing the full url to your request.

Aborting the request will only throw errors if `rejectOnCancel` is true on either the request or the instance, it's silent otherwise.

---
```typescript
const request = api.get('...')

request.then(response => {
    // ....
}).catch(err => {
    if(err.errorReason === 'REQUEST_ABORTED'){
        // handle abortion here
    }
})

request.abort()
```

#### Sending multipart

The data object will be transformed to multipart

---
```typescript
const request = api.post('...', {
    image: ImageObject,
    data: {
        label: 'Cool picture'
    }
}, {
   multipart: true, // If just a boolean is passed, defaultOptions will be used
   multipart: { 
        keyTransforms: {
            image: 'file', // image key will be sent as file in multipart
            data: 'json',  // and data will be stringified
            file: 'file',  // You may extend this object as you please
        },
   }
})
```

#### Duplicate behavior

With maintainPrevious

---
```typescript
const api = new RequestClient({
    baseURL: 'your-api-url',
    duplicateBehavior: 'maintainPrevious' // will throw error if a request to the same url is already in progress
})

api.get('...')
const request = api.get('...')

request.then(response => {
    // ....
}).catch(err => {
    if(err.statusText === 'ALREADY_IN_PROGRESS'){
        // handle duplicate
    }
})
```

With cancelPrevious

---
```typescript
const api = new RequestClient({
    baseURL: 'your-api-url',
    duplicateBehavior: 'cancelPrevious' // Abort previous request and stick to new one
})

api.get('...') // This will be ignored
const request = api.get('...')

request.then(response => {
    // ...
}).catch(err => {
    // ... 
})
```