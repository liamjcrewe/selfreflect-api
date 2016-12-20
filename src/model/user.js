import pool from '../db'
import bcrypt from 'bcrypt'
import handleDBErr from './error'

const saltRounds = 10

export const create = (email, password, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      /* istanbul ignore if */
      if (err) {
        return handleDBErr(err, connection, callback)
      }

      connection.query(
        'INSERT INTO user(email, password) VALUES (?, ?)',
        [email, hash],
        (err, result) => {
          /* istanbul ignore if */
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          connection.query(
            'SELECT id, email FROM user WHERE id = ?',
            [result.insertId],
            (err, result) => {
              /* istanbul ignore if */
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
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT id, email FROM user WHERE id = ?',
      [id],
      (err, result) => {
        /* istanbul ignore if */
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        connection.release()

        callback(false, result[0])
      }
    )
  })
}

export const getUserByEmail = (email, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT id, email FROM user WHERE email = ?',
      [email],
      (err, result) => {
        /* istanbul ignore if */
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
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      /* istanbul ignore if */
      if (err) {
        return handleDBErr(err, connection, callback)
      }

      connection.query(
        'UPDATE user SET email = ?, password = ? WHERE id = ?',
        [email, hash, id],
        (err, result) => {
          /* istanbul ignore if */
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          connection.query(
            'SELECT id, email FROM user WHERE id = ?',
            [id],
            (err, result) => {
              /* istanbul ignore if */
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
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT id FROM user WHERE id = ?',
      [id],
      (err, result) => {
        /* istanbul ignore if */
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        connection.query(
          'DELETE FROM user WHERE id = ?',
          [id],
          (err, result) => {
            /* istanbul ignore if */
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
