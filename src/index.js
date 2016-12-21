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
app.post('/users', (req, res) => {
  createUser(req.body, res)
})

app.get('/users/:id', (req, res) => {
  getUser(parseInt(req.params.id, 10), res)
})

app.put('/users/:id', (req, res) => {
  putUser(parseInt(req.params.id, 10), req.body, res)
})

app.delete('/users/:id', (req, res) => {
  removeUser(parseInt(req.params.id, 10), res)
})

app.get('/users/:id/wellbeing', (req, res) => {
  res.json({ message: 'Get user wellbeing data' })
})

app.post('/users/:id/wellbeing', (req, res) => {
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

app.use(function (req, res, next) {
  res.status(404).json({ message: 'No resource here' })
})

/* Start server */
const server = app.listen(3000)

console.log('Express server started on port %s', server.address().port)

export default server
