const { BlueBirdie } = require('bluebirdie');

const twitter = new BlueBirdie({
  apiKey: process.env.API_KEY,
  apiSecretKey: process.env.API_SECRET,
  accessToken: '',
  accessTokenSecret: '',
  bearerToken: '',
})

twitter.app.getBearerToken()
  .then(res => {
    twitter.app.setBearerToken(res.access_token);
    twitter.app.get("/2/tweets/1228393702244134912")
      .then(results => {
        console.log("results", results);
      })
  })
