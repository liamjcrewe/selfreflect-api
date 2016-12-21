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
      request.post('/users')
      .send({
        email: testEmail,
        password: 'testpassword'
      })
      .expect(201)
      .end((_, res) => {
        expect(res.body.email).to.eql(testEmail)

        const id = res.body.id

        expect(res.headers.location).to.eql('/users/' + id)

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
      request.post('/users')
        .send(user)
        .expect(409)
        .end((_, res) => {
          expect(res.body.error).to.eql('Email already in use')

          done()
        })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not create a user if no email given', done => {
    request.post('/users')
    .send({
      password: 'testpassword'
    })
    .expect(400)
    .end((_, res) => {
      expect(res.body.error).to.eql('Missing email or password field(s)')

      done()
    })
  }),
  it('should not create a user if no password given', done => {
    request.post('/users')
      .send({
        email: testEmail
      })
      .expect(400)
      .end((_, res) => {
        expect(res.body.error).to.eql('Missing email or password field(s)')

        done()
      })
  }),
  it('should retrieve a user when given a valid id', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body).to.eql({
              id: id,
              email: testEmail
            })

            done()
          })
      })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should report an error for invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.get('/users/' + 0)
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should report an error for invalid user id type', done => {
    jwt.sign({ id: 'invalid', exp: expiry }, secret, {}, (_, token) => {
      request.get('/users/invalid')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should return 404 for id of user that does not exist', done => {
    jwt.sign({ id: 9999, exp: expiry }, secret, {}, (_, token) => {
      request.get('/users/9999')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  }),
  it('should update a user\'s email', done => {
    const updatedUser = {
      email: 'test2@test.com', // change
      password: 'password' // no change
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(200)
          .end((_, res) => {
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
      password: 'password2' // change
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(200)
          .end((_, res) => {
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
        request.put('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(400)
          .end((_, res) => {
            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with no password', done => {
    const updatedUser = {
      email: testEmail,
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(400)
          .end((_, res) => {
            expect(res.body.error).to.eql(
              'Missing email or password field(s)'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject put with invalid id', done => {
    const updatedUser = {
      email: testEmail,
      password: 'password'
    }

    const test = id => {
      jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
        request.put('/users/' + 0)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(404)
          .end((_, res) => {
            expect(res.body.error).to.eql(
              'Invalid user id'
            )

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should delete a user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.delete('/users/' + id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.message).to.eql('User deleted')

            request.get('/users/' + id)
              .set('Authorization', 'Bearer ' + token)
              .expect(404)
              .end((_, res) => {
                expect(res.body.error).to.eql('No user found with this id')

                done()
              })
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject deletion of user with invalid id', done => {
    jwt.sign({ id: 'invalid', exp: expiry }, secret, {}, (_, token) => {
      request.delete('/users/invalid')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject deletion of user that does not exist', done => {
    jwt.sign({ id: 9999, exp: expiry }, secret, {}, (_, token) => {
      request.delete('/users/9999')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  })
})
