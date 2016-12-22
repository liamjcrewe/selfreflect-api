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
        'INSERT INTO user (email, password) VALUES (?, ?)',
        [email, hash],
        (err, result) => {
          /* istanbul ignore if */
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          getById(result.insertId, callback)
        }
      )
    })
  })
}

export const getById = (id, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT * FROM user WHERE id = ?',
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

export const getByEmail = (email, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT * FROM user WHERE email = ?',
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

          getById(id, callback)
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

    getById(id, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        return handleDBErr(err, connection, callback)
      }

      connection.query(
        'INSERT INTO user_archive (id, email, password) VALUES (?, ?, ?)',
        [id, user.email, user.password],
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
  })
}
