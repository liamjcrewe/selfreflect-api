import pool from '../db'
import handleDBErr from './error'

export const create = (id, wellbeing, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'INSERT INTO wellbeing (user_id, wellbeing) VALUES (?, ?)',
      [id, wellbeing],
      (err, result) => {
        /* istanbul ignore if */
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        get(result.insertId, 1, (err, result) => {
          /* istanbul ignore if */
          if (err) {
            return handleDBErr(err, connection, callback)
          }

          callback(false, result[0])
        })
      }
    )
  })
}

export const get = (id, limit, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT * FROM wellbeing WHERE user_id = ? ' +
      'ORDER BY date_recorded DESC, id DESC LIMIT ?',
      [id, limit],
      (err, result) => {
        /* istanbul ignore if */
        if (err) {
          return handleDBErr(err, connection, callback)
        }

        callback(false, result)
      }
    )
  })
}
