import pool from '../../build/db'
import { compose } from 'ramda'

const truncateTable = (connection, table) => () => {
  connection.query("TRUNCATE TABLE " + table)
}

export const runOnEmptyDB = callback => {
  pool.getConnection((err, connection) => {
    compose(
      callback,
      connection.release,
      truncateTable(connection, 'user_archive'),
      truncateTable(connection, 'user')
    )()
  })
}

export const insertUser = (email, hash, callback) => {
  pool.getConnection((err, connection) => {
    connection.query(
      "INSERT INTO user(email, password) VALUES (?, ?)",
      [email, hash],
      (err, result) => {
        connection.release()

        callback(result.insertId)
      }
    )
  })
}
