import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { stravaTestCode } from '../../config/strava'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
const twitter_username = 'username'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'
// 5 minute expiry
const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

describe('Strava data endpoint', () => {
  it('should get a user\'s strava data', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id + '/strava-credentials')
          .set('Authorization', 'Bearer ' + token)
          .send({
            code: stravaTestCode
          })
          .end((_, res) => {
            request.get('/v1/users/' + id + '/strava-data')
              .set('Authorization', 'Bearer ' + token)
              .end((_, res) => {
                // Test account has one entry...
                expect(res.body.length).to.equal(1)

                // ... of a 5km run
                expect(res.body[0].distance).to.equal(5000)

                done()
              })
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username, // use twitter username for test, as this should always exist
      test
    ))
  })
  it('should reject getting a user\'s strava data with id of non existent user', done => {
    const id = 9999

    jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
      request.put('/v1/users/' + id + '/strava-credentials')
        .set('Authorization', 'Bearer ' + token)
        .send({
          code: stravaTestCode
        })
        .end((_, res) => {
          request.get('/v1/users/' + id + '/strava-data')
            .set('Authorization', 'Bearer ' + token)
            .end((_, res) => {
              expect(res.status).to.eql(404)

              expect(res.body.error).to.eql('No user found with this id')

              done()
            })
        })
    })
  }),
  it('should not allow a user to get a different user\'s strava data', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id + '/strava-credentials')
          .set('Authorization', 'Bearer ' + token)
          .send({
            code: stravaTestCode
          })
          .end((_, res) => {
            request.get('/v1/users/' + (id + 1) + '/strava-data')
              .set('Authorization', 'Bearer ' + token)
              .end((_, res) => {
                expect(res.status).to.eql(403)

                expect(res.body.error).to.eql('Forbidden')

                done()
              })
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
  it('should reject getting a user\'s strava data if strava not connected for user', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/strava-data')
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql('Strava not connected for this user')

            done()
          })
      })
    }

    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      '', // empty twitter username
      test
    ))
  })
})
