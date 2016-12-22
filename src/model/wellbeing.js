import pool from '../db'
import handleDBErr from './error'

export const get = (id, limit, callback) => {
  pool.getConnection((err, connection) => {
    /* istanbul ignore if */
    if (err) {
      return handleDBErr(err, connection, callback)
    }

    connection.query(
      'SELECT wellbeing, date_recorded ' +
      'FROM wellbeing WHERE user_id = ? ' +
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
