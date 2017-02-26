import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
const twitter_username = 'username'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'
// 5 minute expiry
const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

describe('Index and overall app', () => {
  it('should reject get with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/' + 0)
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject put with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.put('/v1/users/' + 0)
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject delete with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.delete('/v1/users/' + 0)
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject get wellbeings with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/' + 0 + '/wellbeings')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject post wellbeings with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.post('/v1/users/' + 0 + '/wellbeings')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject get tweets with invalid user id', done => {
    jwt.sign({ id: 0, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/' + 0 + '/tweets')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should report an error for invalid user id type', done => {
    jwt.sign({ id: 'invalid', exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/users/invalid')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Invalid user id')

          done()
        })
    })
  }),
  it('should reject request that requires auth, without an access token', done => {
    // Can just use id 1, as should never get to this part anyway
    request.get('/v1/users/1')
      .end((_, res) => {
        expect(res.status).to.eql(401)

        expect(res.body.error).to.eql('Unauthorized')

        done()
      })
  }),
  it('should reject request that requires auth, with an invalid token', done => {
    // Can just use id 1, as should never get to this part anyway
    request.get('/v1/users/1')
      .set('Authorization', 'Bearer InvalidToken')
      .end((_, res) => {
        expect(res.status).to.eql(401)

        expect(res.body.error).to.eql('Unauthorized')

        done()
      })
  }),
  it('should reject request that requires auth, with an expired token', done => {
    const anHourAgo = Math.floor(Date.now() / 1000) - (60 * 60)
    // Can just use id 1, as should never get to this part anyway
    jwt.sign({ id: 1, exp: anHourAgo }, secret, {}, (_, token) => {
      request.get('/v1/users/1')
        .set('Authorization', 'Bearer InvalidToken')
        .end((_, res) => {
          expect(res.status).to.eql(401)

          expect(res.body.error).to.eql('Unauthorized')

          done()
        })
    })
  }),
  it('should not allow a user to get a different user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not allow a user to put a different user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not allow a user to delete a different user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.delete('/v1/users/' + (id + 1))
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not allow a user to get a different user\'s wellbeing', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + (id + 1) + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not allow a user to post a different user\'s wellbeing', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.post('/v1/users/' + (id + 1) + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not allow a user to get a different user\'s tweets', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + (id + 1) + '/tweets')
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(403)

            expect(res.body.error).to.eql('Forbidden')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should reject posting a user\s wellbeing without wellbeing data', done => {
    const test = id => {
      const postData = {}

      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.post('/v1/users/' + id + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .send(postData)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql('Missing wellbeing field')

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should reject posting a user\s wellbeing with invalid wellbeing', done => {
    const test = id => {
      const postData = {
        wellbeing: 1
      }

      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.post('/v1/users/' + id + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .send(postData)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql(
              'Invalid wellbeing value - must be an integer between 7 and 35'
            )

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should handle unknown routes via 404', done => {
    // Can just use id 1, as jwt just needs to decode successfully
    jwt.sign({ id: 1, exp: expiry }, secret, {}, (_, token) => {
      request.get('/v1/some/unknown/route')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('Requested URL not found')

          done()
        })
    })
  })
})
