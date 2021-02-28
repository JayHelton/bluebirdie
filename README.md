<!-- <p align="center"><img src="logo.png" /></p> -->

<h1 align="center"> BlueBirdie 🐦</h1>

<p align="center"> A modern client for the Twitter API </p>

<hr/>

> BlueBirdie is very new and still in it's **_experimental_** phase. Especially with the streaming. Until the 1.0 release, this library is highly likely to change. All parts of BlueBirdie are under construction.

<p>BlueBirdie is yet another NodeJS interface for the Twitter API. Why did I make it? Because the other 3 libraries I found were not being maintained and I felt I could actually keep up with this one. With the upcoming Version 2 of the Twitter API, I wanted to be sure that a library can support that, as well as the painful way developers have to interact with Twitters Version 1 API. Why should you use this?</p>

<ul>
  <li>A clear abstraction between the Application and User Authentication Types</li>
  <li>Support for Version 1 endpoints.</li>
  <li>Support for Version 2 endpoints.</li>
  <li>Nice abstraction of the OAuth authentication requirements.</li>
  <li>Easy to use Streaming API.</li>
</ul>

<h3> Download & Installation </h3>

```shell
$ yarn add bluebirdie
```

<h3> Application Example </h3>

```javascript
const twitter = new BlueBirdie({
  apiKey: 'api_key',
  apiSecretKey: 'api_secret_key',
  bearerToken: 'bearer_token',
});

twitter.app
  .get('/1.1/statuses/lookup.json', {
    params: {
      id: ['1278747501642657792', '1255542774432063488'],
    },
  })
  .then(data => console.log({ resultOne: data }));

twitter.app
  .get('/2/tweets', {
    params: {
      ids: ['1278747501642657792', '1255542774432063488'], // Edit Tweet IDs to look up
      'tweet.fields': ['lang', 'author_id'], // Edit optional query parameters here
      'user.fields': 'created_at', // Edit optional query parameters here
    },
  })
  .then(data => console.log({ resultTwo: data }));
```

<h3> User Example </h3>

```javascript

const twitter = new BlueBirdie({
  apiKey: 'api_key',
  apiSecretKey: 'api_secret_key',,
  accessToken: 'access_token',
  accessTokenSecret: 'access_token_secret'
})

twitter.user.postForm("/1.1/statuses/update.json", { status: 'testing 12345' })
  .then(results => {
    console.log("results", results);
  })
  .catch(err => console.log({ err }))

twitter.user.post('/1.1/direct_messages/events/new.json',
  {
    event: {
      type: 'message_create',
      message_create: {
        target: { recipient_id: '123456' },
        message_data: { text: 'Hello World!' }
      }
    }
  })
  .then(results => {
    console.log('results', results);
  })
  .catch(err => console.log({ err }))

twitter.user.get('/1.1/statuses/lookup.json', {
  params: {
    id: ["1278747501642657792", "1255542774432063488"],
  }
}).then(data => console.log({ resultOne: data }));

twitter.user.get('/2/tweets', {
  params: {
    "ids": ["1278747501642657792", "1255542774432063488"], // Edit Tweet IDs to look up
    "tweet.fields": ["lang", "author_id"], // Edit optional query parameters here
    "user.fields": "created_at" // Edit optional query parameters here
  }
}).then(data => console.log({ resultTwo: data }));
```

<br/>

<h3> Streaming Examples </h3>

> Twitters API v2 supports streaming for Applications and User Contexts. The version 1 API only allows streaming from the User Context.

<h4> Version 2 </h4>
<br/>

```javascript
const rules = [
  {
    value: 'dog has:images -is:retweet',
    tag: 'dog pictures',
  },
  {
    value: 'cat has:images -grumpy',
    tag: 'cat pictures',
  },
];

await twitter.app.post('/2/tweets/search/stream/rules', { add: rules });

// This can be twitter.user or twitter.app
const stream = await twitter.app.getStream('/2/tweets/search/stream');
stream
  .on('data', data => {
    console.log({ yay: data });
  })
  .on('error', err => {
    console.log(err);
  });
```

<h4> Version 1 </h4>
<br/>

```javascript
// Currently, there is a manual baseURL override, since version 1 api is on a different domain. If the bluebird client instance is only going to be used for version 1 stream, the domain can be set in the config.
await stream = twitter.user.postStream(
  '/1.1/statuses/filter.json',
  { track: 'jojo' },
  { baseURL: 'https://stream.twitter.com' }
);

stream
  .on('data', data => {
    console.log({ yay: data });
  })
  .on('error', err => {
    console.log(err);
  });
```

<h3> Upcoming Examples</h3>
<ul>
  <li>Requesting Bearer Tokens and Access Tokens</li>
  <li>Full User OAuth Flow Example</li>
  <li>More Streaming Examples (streaming API is under heavy construction)</li>
</ul>

<h3> Upcoming for BlueBirdie</h3>
<ul>
  <li>Lots of test writing</li>
  <li>Better Exmaples</li>
  <li>A Simpler Streaming API without 3rd party depedencies</li>
  <li>I am also brainstorming some ideas for easy abstractions on common use cases that would other be reimplemented in each project</li>
</ul>

<h3>Contributing</h3>
Contributors are always welcome! I would love new ideas and thoughts. I have a specific direction I am wanting this project to go in.
<br/><br/>
<h3>License</h3>
This project is licensed under the MIT License
