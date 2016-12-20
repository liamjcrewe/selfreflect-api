describe('Users endpoint', () => {
  it('should create and return a user', done => {
    request.post('/users')
      .send({
        email: 'test@test.com',
        password: 'testpassword'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.email).to.eql('test@test.com')

        const id = res.body.id

        expect(res.headers.location).to.eql('/users/' + id)

        done(err)
      })
  }),
  it('should not create a user if no email given', done => {
    request.post('/users')
      .send({
        password: 'testpassword'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Missing email or password field(s)')

        done(err)
      })
  }),
  it('should not create a user if no password given', done => {
    request.post('/users')
      .send({
        email: 'test@test.com'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Missing email or password field(s)')

        done(err)
      })
  }),
  it('should retrieve a user when given a valid id', done => {
    request.post('/users')
      .send({
        email: 'test@test.com',
        password: 'testpassword'
      })
      .end((err, res) => {
        const id = res.body.id
        request.get('/users/' + id)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              id: id,
              email: 'test@test.com'
            })
          })

        done()
      })
  }),
  it('should report an error for invalid user id', done => {
    request.get('/users/' + 0)
      .expect(404)
      .end((err, res) => {
        expect(res.body.error).to.eql('Invalid user id')

        done()
      })
  }),
  it('should report an error for invalid user id type', done => {
    request.get('/users/invalid')
      .expect(404)
      .end((err, res) => {
        expect(res.body.error).to.eql('Invalid user id')

        done()
      })
  }),
  it('should return 404 for id of user that does not exist', done => {
    request.get('/users/9999')
      .expect(404)
      .end((err, res) => {
        expect(res.body.error).to.eql('No user found with this id')

        done()
      })
  }),
  it('should update a user\'s email', done => {
    const initialUser = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    const updatedUser = {
      email: 'test2@test.com',
      password: 'testpassword'
    }

    request.post('/users')
      .send(initialUser)
      .end((err, res) => {
        const id = res.body.id
        request.put('/users/' + id)
          .send(updatedUser)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              id: id,
              email: updatedUser.email
            })
          })

        done()
      })
  }),
  it('should update a user\'s password', done => {
    const initialUser = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    const updatedUser = {
      email: 'test@test.com',
      password: 'testpassword2'
    }

    request.post('/users')
      .send(initialUser)
      .end((err, res) => {
        const id = res.body.id
        request.put('/users/' + id)
          .send(updatedUser)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              id: id,
              email: initialUser.email
            })
          })

        done()
      })
  }),
  it('should reject put with no email', done => {
    const initialUser = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    const updatedUser = {
      password: 'testpassword'
    }

    request.post('/users')
      .send(initialUser)
      .end((err, res) => {
        const id = res.body.id
        request.put('/users/' + id)
          .send(updatedUser)
          .expect(400)
          .end((err, res) => {
            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )
          })

        done()
      })
  }),
  it('should reject put with no password', done => {
    const initialUser = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    const updatedUser = {
      email: 'test@test.com',
    }

    request.post('/users')
      .send(initialUser)
      .end((err, res) => {
        const id = res.body.id
        request.put('/users/' + id)
          .send(updatedUser)
          .expect(400)
          .end((err, res) => {
            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )
          })

        done()
      })
  }),
  it('should reject put with invalid id', done => {
    const initialUser = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    const updatedUser = {
      email: 'test@test.com',
    }

    request.post('/users')
      .send(initialUser)
      .end((err, res) => {
        request.put('/users/' + 0)
          .send(updatedUser)
          .expect(404)
          .end((err, res) => {
            expect(res.body.error).to.eql(
              'Missing id'
            )
          })

        done()
      })
  }),
  it('should delete a user', done => {
    const user = {
      email: 'test@test.com',
      password: 'testpassword'
    }

    request.post('/users')
      .send(user)
      .end((err, res) => {
        const id = res.body.id
        request.delete('/users/' + id)
          .expect(200)
          .end((err, res) => {
            request.get('/users/' + id)
              .expect(404)
              .end((err, res) => {
                console.log(res)

                expect(res.body.error).to.eql('No user found with this id')
              })
          })

        done()
      })
  }),
  it('should reject deletion of user with invalid id', done => {
    request.delete('/users/invalid')
      .expect(404)
      .end((err, res) => {
        expect(res.body.error).to.eql('Missing id')

        done()
      })
  }),
  it('should reject deletion of user that does not exist', done => {
    request.delete('/users/9999')
      .expect(404)
      .end((err, res) => {
        expect(res.body.error).to.eql('No user found with this id')

        done()
      })
  })
})
