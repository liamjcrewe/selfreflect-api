import jwt from 'jsonwebtoken'
import { getByEmail as getUserByEmail } from '../model/user'
import bcrypt from 'bcrypt'
import { secret } from '../../config/auth'

const getExpiry = secondsFromNow => {
  const nowInSeconds = Math.floor(Date.now() / 1000)

  return nowInSeconds + (60 * 60 * 24)
}

const generateToken = (id, expiry, res) => {
  jwt.sign({ id: id, exp: expiry }, secret, {}, (err, token) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'An error occurred' })

      return
    }

    res.status(200).json({ id: id, token: token })
  })
}

export const create = (body, res) => {
  const email = body.email
  const password = body.password

  getUserByEmail(email, (err, user) => {
    /* istanbul ignore if */
    if (err) {
      res.status(500).json({ error: 'DB error' })

      return
    }

    // No user found with this email
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })

      return
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      /* istanbul ignore if */
      if (err) {
        res.status(500).json({ error: 'An error occurred' })

        return
      }

      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' })

        return
      }

      // Expire in one day
      const expiry = getExpiry(60 * 60 * 24)

      generateToken(user.id, expiry, res)
    })
  })
}

export const refresh = (token, res) => {
  // Expire in one day
  const expiry = getExpiry(60 * 60 * 24)

  generateToken(token.id, expiry, res)
}