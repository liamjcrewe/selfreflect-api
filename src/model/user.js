import pool from '../db'
import bcrypt from 'bcrypt'
import handleDBErr from './error'

const saltRounds = 10

export const create = (email, password, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return handleDBErr(err, connection, callback)
    }

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

export const get = (id, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT id, email FROM user WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        connection.release()

        callback(false, result[0])
      }
    )
  })
}

export const put = (id, email, password, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return handleDBErr(err, connection, callback)
      }

      connection.query(
        'UPDATE user SET email = ?, password = ? WHERE id = ?',
        [email, hash, id],
        (err, result) => {
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          connection.query(
            'SELECT id, email FROM user WHERE id = ?',
            [id],
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

export const remove = (id, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT id FROM user WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        connection.query(
          'DELETE FROM user WHERE id = ?',
          [id],
          (err, result) => {
            if (err) {
              return handleDBErr(err, connection, callback)
            }

            connection.release()

            callback(false)
          }
        )
      }
    )
  })
}
