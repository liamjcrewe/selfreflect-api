import pool from '../../build/db'

export const runOnEmptyDB = callback => {
  pool.getConnection((err, connection) => {
    connection.query(
      "TRUNCATE TABLE user;",
      (err, result) => {
        connection.release()

        callback()
      }
    )
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
