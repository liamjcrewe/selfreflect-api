import mysql from 'mysql'
import dbConfig from '../config/db'

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: dbConfig.connectionLimit
})

export default pool
