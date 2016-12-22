import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'
// 5 minute expiry
const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

describe('Index and overall app', () => {
  it('should reject get with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/' + 0)
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject put with invalid user id', done => {
    const updatedUser = {
      email: testEmail,
      password: 'password'
    }

    const test = id => {
      jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + 0)
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(404)
          .end((_, res) => {
            expect(res.body.error).to.eql('Invalid user id')

            done()
          })
      })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject delete with invalid user id', done => {
    jwt.sign({ id: 'invalid', exp: expiry }, secret, {}, (_, token) => {
      request.delete('/v1/users/invalid')
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
      request.get('/v1/users/invalid')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end((_, res) => {
          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject request that requires auth, without an access token', done => {
    const test = id => {
      request.get('/v1/users/' + id)
        .expect(401)
        .end((_, res) => {
          expect(res.body.error).to.eql('Unauthorized')

          done()
        })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not allow a user to get a different user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .expect(403)
          .end((_, res) => {
            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not allow a user to put a different user', done => {
    const updatedUser = {
      email: 'test2@test.com', // change
      password: 'password' // no change
    }

    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .send(updatedUser)
          .expect(403)
          .end((_, res) => {
            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not allow a user to delete a different user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.delete('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .expect(403)
          .end((_, res) => {
            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should handle unknown routes via 404', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/some/unknown/route')
          .set('Authorization', 'Bearer ' + token)
          .expect(404)
          .end((_, res) => {
            expect(res.body.error).to.eql('Requested URL not found')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  })
})
