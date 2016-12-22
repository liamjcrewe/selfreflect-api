import pool from '../../build/db'
import Q from 'q'

const setForiegnKeyConstraints = (connection, flag) => {
  var defer = Q.defer()

  connection.query('SET FOREIGN_KEY_CHECKS = ?', flag, defer.makeNodeResolver())
}

const truncateTable = (connection, table) => {
  var defer = Q.defer()

  connection.query('TRUNCATE TABLE ??', table, defer.makeNodeResolver())
}

export const runOnEmptyDB = callback => {
  pool.getConnection((_, connection) => {
    Q.all([
      setForiegnKeyConstraints(connection, 0),
      truncateTable(connection, 'user'),
      truncateTable(connection, 'user_archive'),
      truncateTable(connection, 'wellbeing'),
      setForiegnKeyConstraints(connection, 1)
    ]).then(() => {
      connection.release()

      callback()
    })
  })
}

export const insertUser = (email, hash, callback) => {
  pool.getConnection((_, connection) => {
    connection.query(
      'INSERT INTO user (email, password) VALUES (?, ?)',
      [email, hash],
      (_, result) => {
        connection.release()

        callback(result.insertId)
      }
    )
  })
}

export const insert10Wellbeings = (id, wellbeings, callback) => {
  if (wellbeings.length !== 10) {
    return callback(id)
  }

  pool.getConnection((_, connection) => {
    const values = [
      [id, wellbeings[0]],
      [id, wellbeings[1]],
      [id, wellbeings[2]],
      [id, wellbeings[3]],
      [id, wellbeings[4]],
      [id, wellbeings[5]],
      [id, wellbeings[6]],
      [id, wellbeings[7]],
      [id, wellbeings[8]],
      [id, wellbeings[9]]
    ]

    connection.query(
      'INSERT INTO wellbeing (user_id, wellbeing) VALUES ?',
      [values],
      (_, result) => {
        connection.release()

        callback(id)
      }
    )
  })
}
