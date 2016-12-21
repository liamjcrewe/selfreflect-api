import express from 'express'
import bodyParser from 'body-parser'
import {
  create as createUser,
  get as getUser,
  put as putUser,
  remove as removeUser
} from './controller/user'
import {
  create as createToken
} from './controller/token'

/* Base Setup */
let app = express()

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
  res.json({ message: 'Token refresh' })
})

/* Start server */
const server = app.listen(3000)

console.log('Express server started on port %s', server.address().port)

export default server
