import express from 'express'
import bodyParser from 'body-parser'
import { create as createUser } from './controller/user'

/* Base Setup */
let app = express()

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Routes */
app.post('/users', (req, res) => {
  res = createUser(req.body, res)
})

app.get('/users/:id', (req, res) => {
  res.json({ message: 'Get user' })
})

app.put('/users/:id', (req, res) => {
  res.json({ message: 'Update user' })
})

app.delete('/users/:id', (req, res) => {
  res.json({ message: 'Delete user' })
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

app.get('/sessions/:hash', (req, res) => {
  res.json({ message: 'Get session' })
})

app.post('/sessions', (req, res) => {
  res.json({ message: 'Auth and session creation' })
})

app.delete('/sessions', (req, res) => {
  res.json({ message: 'Log out and session destruction' })
})

/* Start server */
const server = app.listen(3000)

console.log('Express server started on port %s', server.address().port)
