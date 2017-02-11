import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'
// 5 minute expiry
const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

describe('Users endpoint', () => {
  it('should create and return a user', done => {
    const test = () => {
      request.post('/v1/users')
      .send({
        email: testEmail,
        password: 'testpassword'
      })
      .end((_, res) => {
        expect(res.status).to.eql(201)

        expect(res.body.email).to.eql(testEmail)

        expect(res.headers.location).to.eql('/v1/users/' + res.body.id)

        done()
      })
    }

    runOnEmptyDB(test)
  }),
  it('should not create a user with duplicate email', done => {
    const user = {
      email: testEmail,
      password: 'password'
    }

    const test = id => {
      request.post('/v1/users')
        .send(user)
        .end((_, res) => {
          expect(res.status).to.eql(409)

          expect(res.body.error).to.eql('Email already in use')

          done()
        })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not create a user if no email given', done => {
    request.post('/v1/users')
    .send({
      password: 'testpassword'
    })
    .end((_, res) => {
      expect(res.status).to.eql(400)

      expect(res.body.error).to.eql('Missing email or password field(s)')

      done()
    })
  }),
  it('should not create a user if no password given', done => {
    request.post('/v1/users')
      .send({
        email: testEmail
      })
      .end((_, res) => {
        expect(res.status).to.eql(400)

        expect(res.body.error).to.eql('Missing email or password field(s)')

        done()
      })
  }),
  it('should retrieve a user when given a valid id', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body).to.eql({
              id: id,
              email: testEmail
            })

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  })
  it('should return 404 for id of user that does not exist', done => {
    jwt.sign({ id: 9999, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/9999')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  }),
  it('should update a user\'s email', done => {
    const updatedUser = {
      email: 'test2@test.com', // change
      oldPassword: 'password',
      newPassword: 'password' // no change
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body).to.eql({
              id: id,
              email: updatedUser.email
            })

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should update a user\'s password', done => {
    const updatedUser = {
      email: testEmail, // no change
      oldPassword: 'password', // change
      newPassword: 'password2' // change
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body).to.eql({
              id: id,
              email: testEmail
            })

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with no email', done => {
    const updatedUser = {
      password: 'password'
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with no new password', done => {
    const updatedUser = {
      email: testEmail,
      oldPassword: 'password'
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with no old password', done => {
    const updatedUser = {
      email: testEmail,
      newPassword: 'password2'
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with wrong old password', done => {
    const updatedUser = {
      email: testEmail,
      oldPassword: 'wrong',
      newPassword: 'password2'
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(401)

            expect(res.body.message).to.eql(
              'Invalid password'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with duplicate email', done => {
    const dupeEmail = 'dupe@dupe.com'

    const updatedUser = {
      email: dupeEmail,
      oldPassword: 'password',
      newPassword: 'password'
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .end((_, res) => {
            expect(res.status).to.eql(409)

            expect(res.body.error).to.eql('Email already in use')

            done()
          })
      })
    }

    runOnEmptyDB(() => {
      insertUser(dupeEmail, passwordHash, () => {
        insertUser(testEmail, passwordHash, test)
      })
    })
  }),
  it('should delete a user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.delete('/v1/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.message).to.eql('User deleted')

            request.get('/v1/users/' + id)
              .set('Authorization', 'Bearer ' + token)
              .end((_, res) => {
                expect(res.status).to.eql(404)

                expect(res.body.error).to.eql('No user found with this id')

                done()
              })
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject deletion of user that does not exist', done => {
    jwt.sign({ id: 9999, exp: expiry }, secret, {}, (_, token) => {
      request.delete('/v1/users/9999')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  })
})
