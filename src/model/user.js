import pool from '../db'
import bcrypt from 'bcrypt'

export const create = (email, password, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      connection.release()

      callback(err)

      return
    }

    const saltRounds = 10

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        connection.release()

        callback(err)

        return
      }

      connection.query(
        'INSERT INTO user(email, password) VALUES (?, ?)',
        [email, hash],
        (err, result) => {
          if (err) {
            connection.release()

            callback(err)

            return
          }

          connection.query(
            'SELECT id, email FROM user WHERE id = ?',
            [result.insertId],
            (err, result) => {
              if (err) {
                connection.release()

                callback(err)

                return
              }

              connection.release()

              callback(false, result)
            }
          )
        }
      )
    })
  })
}
