import {
  create as createUser,
  getById as getUserById,
  getByEmail as getUserByEmail,
  put as putUser,
  remove as removeUser
} from '../model/user'

import bcrypt from 'bcrypt'

export const create = (body, res) => {
  const email = body.email
  const password = body.password // to be hashed
  const twitter = body.twitter_username

  if (!email || !password || twitter === undefined) {
    return res.status(400).json({ error: 'Missing field(s)' })
  }

  getUserByEmail(email, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    // User already exists
    if (user) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    createUser(email, password, twitter, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        return res.status(500).json({ error: 'DB error' })
      }

      // Don't want to send password back
      delete user.password
      // or strava token
      delete user.strava_token

      res.status(201).set({
        'Location': '/v1/users/' + user.id
      }).json(user)
    })
  })
}

export const get = (id, res) => {
  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found with this id' })
    }

    // Don't want to send password back
    delete user.password
    // or strava token
    delete user.strava_token

    res.status(200).json(user)
  })
}

export const put = (id, body, res) => {
  const email = body.email
  const oldPassword = body.oldPassword
  const newPassword = body.newPassword // to be hashed
  const twitter = body.twitter_username

  if (!email || !oldPassword || !newPassword || twitter === undefined) {
    return res.status(400).json({ error: 'Missing field(s)' })
  }

  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    getUserByEmail(email, (err, userWithEmail) => {
      /* istanbul ignore if */
      if (err) {
        return res.status(500).json({ error: 'DB error' })
      }

      // Email in use (by a different user than the current user)
      if (userWithEmail && userWithEmail.id !== id) {
        return res.status(409).json({ error: 'Email already in use' })
      }

      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        /* istanbul ignore if */
        if (err) {
          return res.status(500).json({ error: 'An error occurred' })
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid password' })
        }

        putUser(id, email, newPassword, twitter, (err, user) => {
          /* istanbul ignore if */
          if (err) {
            return res.status(500).json({ error: 'DB error' })
          }

          // Don't want to send password back
          delete user.password
          // or strava token
          delete user.strava_token

          res.status(200).json(user)
        })
      })
    })
  })
}

export const remove = (id, res) => {
  getUserById(id, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return res.status(500).json({ error: 'DB error' })
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found with this id' })
    }

    removeUser(user, err => {
      /* istanbul ignore if */
      if (err) {
        return res.status(500).json({ error: 'DB error' })
      }

      res.status(200).json({ message: 'User deleted' })
    })
  })
}
