import {
  create as createUser,
  get as getUser,
  put as putUser
} from '../model/user'

const isValidId = id => {
  return Number.isInteger(id) && (id > 0)
}

export const create = (body, res) => {
  const email = body.email
  const password = body.password // to be hashed

  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password field(s)' })

    return
  }

  createUser(email, password, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(201).set({
      'Location': '/users/' + user.id
    }).json(user)
  })
}

export const get = (id, res) => {
  if (!isValidId(id)) {
    res.status(400).json({ error: 'Invalid user id' })

    return
  }

  getUser(id, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(200).json(user)
  })
}

export const put = (id, body, res) => {
  const email = body.email
  const password = body.password // to be hashed

  if (!isValidId(id) || !email || !password) {
    res.status(400).json({ error: 'Missing id, email or password field(s)' })

    return
  }

  putUser(id, email, password, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(201).json(user)
  })
}
