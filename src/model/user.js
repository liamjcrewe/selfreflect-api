import pool from '../db'
import bcrypt from 'bcrypt'
import handleDBErr from './error'

export const create = (email, password, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    const saltRounds = 10

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return handleDBErr(err, connection, callback)
      }

      connection.query(
        'INSERT INTO user(email, password) VALUES (?, ?)',
        [email, hash],
        (err, result) => {
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          connection.query(
            'SELECT id, email FROM user WHERE id = ?',
            [result.insertId],
            (err, result) => {
              if (err) {
                return handleDBErr(err, connection, callback)
              }

              connection.release()

              callback(false, result[0])
            }
          )
        }
      )
    })
  })
}
