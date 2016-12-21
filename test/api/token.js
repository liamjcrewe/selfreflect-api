import { runOnEmptyDB, insertUser } from '../helper/db.js'
import jwt from 'jsonwebtoken'
import { secret } from '../../config/auth'

const testEmail = 'test@test.com'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'

describe('Tokens endpoint', () => {
  it('creates an access token', done => {
    const test = id => {
      request.post('/tokens')
        .send({
          email: testEmail,
          password: 'password'
        })
        .expect(200)
        .end((_, res) => {
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
  it('doesn\'t create an access token for an invalid password', done => {
    const test = id => {
      request.post('/tokens')
        .send({
          email: testEmail,
          password: 'invalid'
        })
        .expect(401)
        .end((_, res) => {
          expect(res.body.message).to.eql('Invalid email or password')

          done()
        })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('doesn\'t create an access token for an invalid email', done => {
    const test = id => {
      request.post('/tokens')
        .send({
          email: 'invalid',
          password: 'password'
        })
        .expect(401)
        .end((_, res) => {
          expect(res.body.message).to.eql('Invalid email or password')

          done()
        })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('refreshes a valid access token', done => {
    const test = id => {
      // 5 minute expiry
      const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.put('/tokens')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            jwt.verify(res.body.token, secret, (_, decoded) => {
              expect(decoded.id).to.eql(id)

              expect(decoded.exp).to.be.a('number')

              expect(decoded.exp).to.be.above(expiry)

              done()
            })
          })
      })
    }

    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  })
})
