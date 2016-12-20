import {
  create as createUser,
  get as getUser,
  getUserByEmail,
  put as putUser,
  remove as removeUser
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

  getUserByEmail(email, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    // User already exists
    if (user) {
      res.status(409).json({ error: 'Email already in use' })

      return
    }

    createUser(email, password, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        res.status(500).json({ error: 'DB error' })

        return
      }

      res.status(201).set({
        'Location': '/users/' + user.id
      }).json(user)
    })
  })
}

export const get = (id, res) => {
  if (!isValidId(id)) {
    res.status(404).json({ error: 'Invalid user id' })

    return
  }

  getUser(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    if (!user) {
      res.status(404).json({ error: 'No user found with this id' })

      return
    }

    res.status(200).json(user)
  })
}

export const put = (id, body, res) => {
  if (!isValidId(id)) {
    res.status(404).json({ error: 'Missing id' })

    return
  }

  const email = body.email
  const password = body.password // to be hashed

  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password field(s)' })

    return
  }

  putUser(id, email, password, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    res.status(200).json(user)
  })
}

export const remove = (id, res) => {
  if (!isValidId(id)) {
    res.status(404).json({ error: 'Missing id' })

    return
  }

  getUser(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    if (!user) {
      res.status(404).json({ error: 'No user found with this id' })

      return
    }

    removeUser(id, err => {
      /* istanbul ignore if */
      if (err) {
        res.status(500).json({ error: 'DB error' })

        return
      }

      res.status(200).json({ message: 'User deleted' })
    })
  })
}
