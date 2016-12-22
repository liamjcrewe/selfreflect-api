import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'

import {
  create as createUser,
  get as getUser,
  put as putUser,
  remove as removeUser
} from './controller/user'

import {
  create as createToken,
  refresh as refreshToken
} from './controller/token'

import {
  post as postWellbeing,
  get as getWellbeing
} from './controller/wellbeing'

import { secret } from '../config/auth'

/* Base Setup and Middleware*/
let app = express()

// Configure app to use bodyParser to get json data from post
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Decode Authorization header token
const jwtMiddleware = jwt({
  secret: secret,
  requestProperty: 'token'
})

// Apply to all paths except "/users" and "POST /tokens"
app.use(jwtMiddleware.unless({
  path: [
    '/v1/users',
    { url: '/v1/tokens', methods: ['POST'] }
  ]
}))

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
})

/* Routes */

const isValidId = id => {
  return Number.isInteger(id) && (id > 0)
}

app.post('/v1/users', (req, res) => {
  createUser(req.body, res)
})

app.get('/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  getUser(id, res)
})

app.put('/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  putUser(id, req.body, res)
})

app.delete('/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  removeUser(id, res)
})

app.get('/v1/users/:id/wellbeings', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  let limit = parseInt(req.query.limit, 10)

  // If none given , or above maximum allowed (50 for now)
  if (!limit || limit > 50) {
    limit = 5
  }

  getWellbeing(id, limit, res)
})

app.post('/v1/users/:id/wellbeings', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.json({ message: 'Post user wellbeing data' })
})

app.post('/v1/users/recoverpassword', (req, res) => {
  res.json({ message: 'Password recovery' })
})

app.post('/v1/tokens', (req, res) => {
  createToken(req.body, res)
})

app.put('/v1/tokens', (req, res) => {
  refreshToken(req.token, res)
})

app.use((req, res, next) => {
  res.status(404).json({ error: 'Requested URL not found' })
})

/* Start server */
const server = app.listen(3000)

console.log('Express server started on port %s', server.address().port)

export default server
