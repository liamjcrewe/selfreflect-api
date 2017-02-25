import pool from '../db'
import bcrypt from 'bcrypt'
import handleDBErr from './error'

const saltRounds = 10

export const create = (email, password, twitter, callback) => {
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
        'INSERT INTO user (email, password, twitter_username) VALUES (?, ?, ?)',
        [email, hash, twitter],
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

export const put = (id, email, password, twitter, callback) => {
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
        'UPDATE user SET email = ?, password = ?, twitter_username = ?' +
        'WHERE id = ?',
        [email, hash, twitter, id],
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

export const remove = (user, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'DELETE FROM user WHERE id = ?',
      [user.id],
      (err, result) => {
        /* istanbul ignore if */
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        connection.release()

        callback(false)
      }
    )
  })
}
