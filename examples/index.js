const { BlueBirdie } = require('bluebirdie');

const twitter = new BlueBirdie({
  apiKey: 'skRzlC5joREB8UC4DmXygrEP1',
  apiSecretKey: '6MIYhFxsVkdC7Vy0JJxo95Raeoq3EUorc9kHcolMMQWZf1onZf',
  accessToken: '',
  accessTokenSecret: '',
  bearerToken: '',
})

// twitter.app.getBearerToken()
//   .then(res => {
//     twitter.app.setBearerToken(res.access_token);
//     twitter.app.get("/2/tweets/1228393702244134912")
//       .then(results => {
//         console.log("results", results);
//       })
//   })

twitter.user.getRequestToken('https://jarretthelton.com/callback').then(res => console.log);
