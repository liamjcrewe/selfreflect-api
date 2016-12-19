const handleDBErr = (err, connection, callback) => {
  connection.release()

  callback(err)
}

export default handleDBErr
