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

describe('Strava credentials endpoint', () => {
  it('should create and store strava access token', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id + '/strava-credentials')
          .set('Authorization', 'Bearer ' + token)
          .send({
            code: stravaTestCode
          })
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.message).to.eql('Strava connected')

            done()
          })
      })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should not create access token for invalid code', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id + '/strava-credentials')
          .set('Authorization', 'Bearer ' + token)
          .send({
            code: 'invalid'
          })
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql('Could not connect Strava')

            done()
          })
      })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should reject missing code', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/v1/users/' + id + '/strava-credentials')
          .set('Authorization', 'Bearer ' + token)
          .send({
            code: ''
          })
          .end((_, res) => {
            expect(res.status).to.eql(400)

            expect(res.body.error).to.eql('No Strava code provided')

            done()
          })
      })
    }

    // empty db, which calls insert user, which calls test with insert id
    runOnEmptyDB(() => insertUser(
      testEmail,
      passwordHash,
      twitter_username,
      test
    ))
  }),
  it('should reject creating access token for non existent user', done => {
    const id = 9999

    jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
      request.put('/v1/users/' + id + '/strava-credentials')
        .set('Authorization', 'Bearer ' + token)
        .send({
          code: stravaTestCode
        })
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  })
})
