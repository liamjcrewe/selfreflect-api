# SelfReflect API

SelfReflect is a project developed as part of a final year BSc Computer Science project at the University of Bath. It is an application to allow users to record their mental health wellbeing, with the goal to allow them to map this wellbeing to other data about them (via external APIs). This will allow users to investigate the relationships between their mental health wellbeing, social media activity (Twitter), music listening habits (last.fm) and exercise information (Strava).

This specific project serves as the backend to SelfReflect, by providing a REST API which includes users, auth and wellbeing scores endpoints. A front end implementation for this API has also been developed, called [SelfReflect Web](https://github.com/liamjcrewe/selfreflect-web).

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->
- [Get started](#get-started)
	- [Initial setup](#initial-setup)
	- [Run server](#run-server)
	- [Run tests](#run-tests)
- [API documentation](#api-documentation)
	- [Auth](#auth)
      - [To get a token](#to-get-a-token)
      - [To use a token (to access restricted endpoints)](#to-use-a-token-to-access-restricted-endpoints)
      - [To refresh a token close to expiry](#to-refresh-a-token-close-to-expiry)
	- [Endpoints](#endpoints)
		- [/v1/users](#v1users)
			- [POST](#post)
				- [Body fields required](#body-fields-required)
				- [Error response(s)](#error-responses)
				- [Success response](#success-response)
		- [/v1/users/:id](#v1usersid)
			- [GET (auth token required)](#get-auth-token-required)
				- [Error response(s)](#error-responses-1)
				- [Success response](#success-response-1)
			- [PUT (auth token required)](#put-auth-token-required)
				- [Body fields required](#body-fields-required-1)
				- [Error response(s)](#error-responses-2)
				- [Success response](#success-response-2)
			- [DELETE (auth token required)](#delete-auth-token-required)
				- [Error response(s)](#error-responses-3)
				- [Success response](#success-response-3)
		- [/v1/users/:id/wellbeings](#v1usersidwellbeings)
			- [GET (auth token required)](#get-auth-token-required-1)
				- [Error response(s)](#error-responses-4)
				- [Success response](#success-response-4)
			- [POST (auth token required)](#post-auth-token-required)
				- [Body fields required](#body-fields-required-2)
				- [Error response(s)](#error-responses-5)
				- [Success response](#success-response-5)
		- [/v1/users/:id/tweets](#v1usersidtweets)
			- [GET (auth token required)](#get-auth-token-required-2)
				- [Error response(s)](#error-responses-6)
				- [Success response](#success-response-6)
		- [/v1/users/:id/strava-credentials](#v1usersidstrava-credentials)
			- [PUT (auth token required)](#put-auth-token-required-1)
				- [Error response(s)](#error-responses-7)
				- [Success response](#success-response-7)
		- [/v1/tokens](#v1tokens)
			- [POST](#post-1)
				- [Body fields required](#body-fields-required-3)
				- [Error response(s)](#error-responses-8)
				- [Success response](#success-response-8)
			- [PUT (auth token required)](#put-auth-token-required-2)
				- [Error response(s)](#error-responses-9)
				- [Success response](#success-response-9)
<!-- /TOC -->

## Get started

### Initial setup
Run the following commands:

```sh
$ git clone git@github.com:liamjcrewe/selfreflect-api.git
$ cd selfreflect-api
$ npm install
$ npm run build
```

Then, create the following config files:
* `config/auth.js`
* `config/db.js`

Example config files have been included in the config directory for both of these.

### Run server

```sh
$ npm run serve
```

### Run tests

```sh
$ npm run test
```

Or, to run with coverage enabled:

```sh
$ npm run test-coverage
```

## API documentation

### Auth
Auth for this API works via JSON Web Tokens, or JWTs. A token must be created and sent in the authorization header of subsequent requests (where the endpoint requested requires authorization).

#### To get a token

To create and get a token do `POST /v1/tokens`, with a valid email and password in the POST body.

Example body:

```js
{
  "email": "your-email",
  "password": "your-password"
}
```

Example response:

```js
{
  "id": your-user-id,
  "token": "your-token",
  "exp": unix-timestamp-when-token-expires
}
```

Tokens are set to expire one day after they are generated.

#### To use a token (to access restricted endpoints)

Send the token in the authorization header in the form:

```
Authorization: Bearer <your-token>
```

This token will then be verified to check it is valid (and not expired).

*Note that valid means the requested resource can be accessed using this token. This means, if a user with a valid token for user id 5, requests endpoint `/v1/users/6`, this is considered an invalid token. This request will be forbidden and will return error code 403.*

#### To refresh a token close to expiry

A second method to generate tokens is to ```PUT /v1/tokens```, with a valid token in the authorization header as discussed above. This is useful for generating new tokens when tokens are close to expiring. This does not require any body in the request, and will return the same response as creating a token, as discussed above.

### Endpoints

#### /v1/users

##### POST

Create a user.

###### Body fields required

```js
{
  "email": "your-email",
  "password": "your-password",
  "twitter_username": "twitter-username"
}
```
Twitter username can be an empty string if required.

Note that there is currently no validation to check for a valid email; this will accept any string.

###### Error response(s)

| HTTP error code | Error message         | Extra info                       |
|-----------------|-----------------------|----------------------------------|
| 400             | Missing field(s)      |                                  |
| 409             | Email already in use  |                                  |
| 500             | DB Error              | Some DB or server error occurred |

###### Success response

Success code: `201`

Header:

```
Location: /v1/users/<created-user-id>
```

Body:

```js
{
  "id": created-user-id,
  "email": "created-user-email",
  "twitter_username": "twitter-username"
}
```

#### /v1/users/:id

A valid id must be provided. Note GET/PUT/DELETE /v1/users are not valid endpoints, so id must be given.

##### GET (auth token required)

Get information about a user.

###### Error response(s)

| HTTP error code | Error message              | Extra info                       |
|-----------------|----------------------------|----------------------------------|
| 403             | Forbidden                  | Invalid or no token provided     |
| 404             | Invalid user id            |                                  |
| 404             | No user found with this id |                                  |
| 500             | DB Error                   | Some DB or server error occurred |

###### Success response

Success code: `200`

Body:

```js
{
  "id": user-id,
  "email": "user-email",
  "twitter_username": "twitter-username"
}
```

##### PUT (auth token required)

Update a user.

###### Body fields required

```js
{
  "email": "user-updated-email",
  "oldPassword": "user-oldPassword",
  "newPassword": "user-newPassword",
  "twitter_username": "updated-twitter-username"
}
```

###### Error response(s)

| HTTP error code | Error message         | Extra info                       |
|-----------------|-----------------------|----------------------------------|
| 400             | Missing field(s)      |                                  |
| 401             | Invalid password      |                                  |
| 403             | Forbidden             | Invalid or no token provided     |
| 404             | Invalid user id       |                                  |
| 409             | Email already in use  |                                  |
| 500             | An error occurred     | Some server error occurred       |
| 500             | DB Error              | Some DB or server error occurred |

###### Success response

Success code: `200`

Header:

```
Location: /v1/users/:id
```

Body:

```js
{
  "id": user-id,
  "email": "user-updated-email",
  "twitter_username": "updated-twitter-username"
}
```

##### DELETE (auth token required)

Delete a user.

###### Error response(s)

| HTTP error code | Error message                      | Extra info                       |
|-----------------|------------------------------------|----------------------------------|
| 403             | Forbidden                          | Invalid or no token provided     |
| 404             | Invalid user id                    |                                  |
| 404             | No user found with this id         |                                  |
| 500             | DB Error                           | Some DB or server error occurred |

###### Success response

Success code: `200`

Body:

```js
{
  "message": "User deleted"
}
```

#### /v1/users/:id/wellbeings

A valid id must be provided.

##### GET (auth token required)

Get most recent recordings. Can access this resource is two ways:

1. /v1/users/:id/wellbeings or
2. /v1/users/:id/wellbeings?limit=X

If the first of these is used, the limit will default to 5. Otherwise, X will be used. However, X must be between 1 and 50 inclusive. If an invalid limit is given, the limit will again default to 5.

###### Error response(s)

| HTTP error code | Error message                                                 | Extra info                       |
|-----------------|---------------------------------------------------------------|----------------------------------|
| 403             | Forbidden                                                     | Invalid or no token provided     |
| 404             | Invalid user id                                               |                                  |
| 500             | DB Error                                                      | Some DB or server error occurred |

###### Success response

Success code: `200`

Body:

```js
{
  id: :id,
  results: [
    {
      id: wellbeing-db-id,
      user_id: :id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: :id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: :id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: :id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: :id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
  ]
}
```

Note date_recorded is date in simplified extended ISO format (ISO 8601). That is, YYYY-MM-DDTHH:mm:ss.sssZ, as seen [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).

##### POST (auth token required)

Add a new wellbeing recording.

###### Body fields required

```js
{
  "wellbeing": <wellbeing>
}
```

Note that wellbeing must be an integer value between 7 and 35 inclusive. This is designed to be the result of the sum of the answers to a SWEMWBS questionnaire ([available here](http://www2.warwick.ac.uk/fac/med/research/platform/wemwbs/development/swemwbs/)). The wellbeing posted should be the total raw score (sum of scores to each question), as the metric score conversion happens automatically in the API back end.

###### Error response(s)

| HTTP error code | Error message                                                 | Extra info                       |
|-----------------|---------------------------------------------------------------|----------------------------------|
| 400             | Missing wellbeing field                                       |                                  |
| 400             | Invalid wellbeing value - must be an integer between 7 and 35 |                                  |
| 403             | Forbidden                                                     | Invalid or no token provided     |
| 404             | Invalid user id                                               |                                  |
| 404             | No user found with this id                                    |                                  |
| 500             | DB Error                                                      | Some DB or server error occurred |

###### Success response

Success code: `201`

Header:

```
Location: /v1/users/:id/wellbeings?limit=1
```

Body:

```js
{
  id: wellbeing-db-id,
  user_id: user-id,
  wellbeing: metric-converted-wellbeing-score,
  date_recorded: "date-wellbeing-recorded"
}
```

Note date_recorded is date in simplified extended ISO format (ISO 8601). That is, YYYY-MM-DDTHH:mm:ss.sssZ, as seen [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).

#### /v1/users/:id/tweets

A valid id must be provided.

##### GET (auth token required)

Get user's last 200 tweets, or fewer if less than 200 exist.

###### Error response(s)

| HTTP error code | Error message                 | Extra info                       |
|-----------------|-------------------------------|----------------------------------|
| 403             | Forbidden                     | Invalid or no token provided     |
| 404             | Invalid user id               |                                  |
| 500             | Could not connect to Twitter  |                                  |
| 500             | DB Error                      | Some DB or server error occurred |

###### Success response

Success code: `200`

Body: As defined by Twitter, [here](https://dev.twitter.com/rest/reference/get/statuses/user_timeline).

#### /v1/users/:id/strava-credentials

A valid id must be provided.

##### PUT (auth token required)

Connect user to strava by providing an access token (via Strava's authorization redirect).

###### Error response(s)

| HTTP error code | Error message            | Extra info                                                              |
|-----------------|--------------------------|-------------------------------------------------------------------------|
| 400             | No Strava code provided  |                                                                         |
| 400             | Could not connect Strava | Can either be due to an invalid code, or an issue with Strava's servers |
| 403             | Forbidden                | Invalid or no token provided                                            |
| 404             | Invalid user id          |                                                                         |
| 500             | DB Error                 | Some DB or server error occurred                                        |

###### Success response

Success code: `200`

Body:

```js
{
  message: "Strava connected"
}
```

#### /v1/tokens

##### POST

Generate an auth token from a valid email and password.

###### Body fields required

```js
{
  "email": "user-email",
  "password": "user-password"
}
```

###### Error response(s)

| HTTP error code | Error message             | Extra info                       |
|-----------------|---------------------------|----------------------------------|
| 401             | Invalid email or password |                                  |
| 500             | DB Error                  | Some DB or server error occurred |
| 500             | An error occurred         | Some other server error occurred |

###### Success response

Success code: `200`

```js
{
  "id": your-user-id,
  "token": "your-token",
  "exp": unix-timestamp-when-token-expires
}
```

##### PUT (auth token required)

Generate an auth token given a valid token in the authorization header.

###### Error response(s)

| HTTP error code | Error message             | Extra info                       |
|-----------------|---------------------------|----------------------------------|
| 401             | Invalid email or password |                                  |
| 500             | DB Error                  | Some DB or server error occurred |
| 500             | An error occurred         | Some other server error occurred |

###### Success response

```js
{
  "id": your-user-id,
  "token": "your-token",
  "exp": unix-timestamp-when-token-expires
}
```
