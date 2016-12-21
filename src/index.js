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
    '/users',
    { url: '/tokens', methods: ['POST'] }
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

app.post('/users', (req, res) => {
  createUser(req.body, res)
})

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  getUser(id, res)
})

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  putUser(id, req.body, res)
})

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Invalid user id' })
  }

  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  removeUser(id, res)
})

app.get('/users/:id/wellbeing', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.json({ message: 'Get user wellbeing data' })
})

app.post('/users/:id/wellbeing', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (req.token.id !== id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.json({ message: 'Post user wellbeing data' })
})

app.post('/users/recoverpassword', (req, res) => {
  res.json({ message: 'Password recovery' })
})

app.post('/tokens', (req, res) => {
  createToken(req.body, res)
})

app.put('/tokens', (req, res) => {
  refreshToken(req.token, res)
})

app.use((req, res, next) => {
  res.status(404).json({ error: 'Requested URL not found' })
})

/* Start server */
const server = app.listen(3000)

console.log('Express server started on port %s', server.address().port)

export default server
