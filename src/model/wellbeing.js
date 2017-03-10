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

        const query = (
          'SELECT ' +
            'raw.id, ' +
            'raw.user_id, ' +
            'metric.metric_score AS wellbeing, ' +
            'raw.date_recorded ' +
          'FROM wellbeing AS raw ' +
          'INNER JOIN swemwbs_conversion AS metric ' +
          'ON (raw.wellbeing = metric.raw_score) ' +
          'WHERE raw.id = ? '
        )

        connection.query(
          query,
          [result.insertId],
          (err, result) => {
            /* istanbul ignore if */
            if (err) {
              return handleDBErr(err, connection, callback)
            }

            callback(false, result[0])
          }
        )
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

    const query = (
      'SELECT ' +
        'raw.user_id, ' +
        'metric.metric_score AS wellbeing, ' +
        'raw.date_recorded ' +
      'FROM wellbeing AS raw ' +
      'INNER JOIN swemwbs_conversion AS metric ' +
      'ON (raw.wellbeing = metric.raw_score) ' +
      'WHERE user_id = ? ' +
      'ORDER BY date_recorded DESC, id DESC LIMIT ?'
    )

    connection.query(
      query,
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
