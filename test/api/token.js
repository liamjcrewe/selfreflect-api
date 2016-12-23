import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'

describe('Tokens endpoint', () => {
  it('should create an access token', done => {
    const test = id => {
      request.post('/v1/tokens')
        .send({
          email: testEmail,
          password: 'password'
        })
        .end((_, res) => {
          expect(res.status).to.eql(200)

          expect(res.body.id).to.eql(id)

          jwt.verify(res.body.token, secret, (_, decoded) => {
            expect(decoded.id).to.eql(id)

            expect(decoded.exp).to.be.a('number')

            done()
          })
        })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should not create an access token for an invalid email', done => {
    request.post('/v1/tokens')
      .send({
        email: 'invalid',
        password: 'password'
      })
      .end((_, res) => {
        expect(res.status).to.eql(401)

        expect(res.body.message).to.eql('Invalid email or password')

        done()
      })
  }),
  it('should not create an access token for an invalid password', done => {
    const test = id => {
      request.post('/v1/tokens')
        .send({
          email: testEmail,
          password: 'invalid'
        })
        .end((_, res) => {
          expect(res.status).to.eql(401)

          expect(res.body.message).to.eql('Invalid email or password')

          done()
        })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should refresh a valid access token', done => {
    // 5 minute expiry
    const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

    // Can just use id 1, as id does not have to be valid to just refresh token
    const id = 1

    jwt.sign({ id: 1, exp: expiry }, secret, {}, (_, token) => {
      request.put('/v1/tokens')
        .set('Authorization', 'Bearer ' + token)
        .end((_, res) => {
          expect(res.status).to.eql(200)

          expect(res.body.id).to.eql(id)

          jwt.verify(res.body.token, secret, (_, decoded) => {
            expect(decoded.id).to.eql(id)

            expect(decoded.exp).to.be.a('number')

            expect(decoded.exp).to.be.above(expiry)

            done()
          })
        })
    })
  })
})
