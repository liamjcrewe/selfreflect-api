# SelfReflect API

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->
- [Get started](#get-started)
	- [Initial setup](#initial-setup)
	- [Run server](#run-server)
	- [Run tests](#run-tests)
- [API documentation](#api-documentation)
	- [Auth](#auth)
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
		- [/v1/tokens](#v1tokens)
			- [POST](#post-1)
				- [Body fields required](#body-fields-required-3)
				- [Error response(s)](#error-responses-6)
				- [Success response](#success-response-6)
			- [PUT (auth token required)](#put-auth-token-required-1)
				- [Error response(s)](#error-responses-7)
				- [Success response](#success-response-7)
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

**To get a token**

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

**To use a token (to access restricted endpoints)**

Send the token in the authorization header in the form:

```
Authorization: Bearer <your-token>
```

This token will then be verified to check it is valid (and not expired).

*Note that valid means the requested resource can be accessed using this token. This means, if a user with a valid token for user id 5, requests endpoint `/v1/users/6`, this is considered an invalid token. This request will be forbidden and will return error code 403.*

**To refresh a token close to expiry**

A second method to generate tokens is to ```PUT /v1/tokens```, with a valid token in the authorization header as discussed above. This is useful for generating new tokens when tokens are close to expiring. This does not require any body in the request, and will return the same response as creating a token, as discussed above.

### Endpoints

#### /v1/users

##### POST

This endpoint is used to create a user.

###### Body fields required

```js
{
  "email": "your-email",
  "password": "your-password"
}
```
Note that there is currently no validation to check for a valid email; this will accept any string.

###### Error response(s)

| HTTP error code | Error message                      | Extra info                       |
|-----------------|------------------------------------|----------------------------------|
| 400             | Missing email or password field(s) |                                  |
| 409             | Email already in use               |                                  |
| 500             | DB Error                           | Some DB or server error occurred |

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
  "password": "created-user-password"
}
```

#### /v1/users/:id

A valid id must be provided. Note GET/POST/DELETE /v1/users are not valid endpoints, so id must be given.

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
  "password": "user-password"
}
```

##### PUT (auth token required)

Update a user.

###### Body fields required

```js
{
  "email": "user-email",
  "oldPassword": "user-oldPassword",
  "newPassword": "user-newPassword"
}
```

###### Error response(s)

| HTTP error code | Error message                      | Extra info                       |
|-----------------|------------------------------------|----------------------------------|
| 400             | Missing email or password field(s) |                                  |
| 401             | Invalid password                   |                                  |
| 403             | Forbidden                          | Invalid or no token provided     |
| 404             | Invalid user id                    |                                  |
| 500             | An error occurred                  | Some server error occurred       |
| 500             | DB Error                           | Some DB or server error occurred |

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
  "email": "updated-user-email",
  "password": "updated-user-password"
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
      user_id: user-id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: user-id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: user-id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: user-id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
    {
      id: wellbeing-db-id,
      user_id: user-id,
      wellbeing: metric-converted-wellbeing-score,
      date_recorded: "date-wellbeing-recorded"
    },
  ]
}
```

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

Date recorded is date in simplified extended ISO format (ISO 8601). That is, YYYY-MM-DDTHH:mm:ss.sssZ, as seen [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).

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
