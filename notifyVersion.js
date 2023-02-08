const axios = require('axios')

const token = process.env.SLACK_TOKEN 

const {version} = require('./packages/mobile/package.json')

axios.post('https://slack.com/api/chat.postMessage', {
    "channel": "#_automation",
    "attachments": [
        {
            "fallback": `Version ${version} released`,
            "title": "Template",
            "text": `Version ${version} released`,
            "color": "#7695EC"
        }
    ],
    "as_user": false,
    "username": "Template Bot",
    "icon_url": "https://avatars.githubusercontent.com/u/48894125?s=200&v=4"
}, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})