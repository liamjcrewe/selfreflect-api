import { runOnEmptyDB, insertUser, insertWellbeings } from '../helper/db.js'
import { secret } from '../../config/auth'
import jwt from 'jsonwebtoken'

const testEmail = 'test@test.com'
// hash for password 'password'
const passwordHash = '$2a$10$aA9hB383J4FzZmv/L.hhdO7M1Vx6KT4gUQg9nb4nJeh7hrpGTzWgS'
// 5 minute expiry
const expiry = Math.floor(Date.now() / 1000) + (60 * 5)

const wellbeings = id => {
  return [
    [id, 1],
    [id, 2],
    [id, 3],
    [id, 4],
    [id, 5],
    [id, 6],
    [id, 7],
    [id, 8],
    [id, 9],
    [id, 10]
  ]
}

describe('Wellbeing endpoint', () => {
  it('should get a user\s last 5 wellbeings with limit specified', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings?limit=5')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(10)
            expect(res.body.results[1].wellbeing).to.eql(9)
            expect(res.body.results[2].wellbeing).to.eql(8)
            expect(res.body.results[3].wellbeing).to.eql(7)
            expect(res.body.results[4].wellbeing).to.eql(6)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(
      // Insert a user
      () => insertUser(testEmail, passwordHash,
        // Pass user id, insert some wellbeing scores, then run test
        id => insertWellbeings(id, wellbeings(id), test)
      )
    )
  }),
  it('should get a user\s last 5 wellbeings without limit specified', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(10)
            expect(res.body.results[1].wellbeing).to.eql(9)
            expect(res.body.results[2].wellbeing).to.eql(8)
            expect(res.body.results[3].wellbeing).to.eql(7)
            expect(res.body.results[4].wellbeing).to.eql(6)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(
      // Insert a user
      () => insertUser(testEmail, passwordHash,
        // Pass user id, insert some wellbeing scores, then run test
        id => insertWellbeings(id, wellbeings(id), test)
      )
    )
  }),
  it('should get a user\s last 5 wellbeings with invalid limit specified', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings?limit=invalid')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(10)
            expect(res.body.results[1].wellbeing).to.eql(9)
            expect(res.body.results[2].wellbeing).to.eql(8)
            expect(res.body.results[3].wellbeing).to.eql(7)
            expect(res.body.results[4].wellbeing).to.eql(6)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(
      // Insert a user
      () => insertUser(testEmail, passwordHash,
        // Pass user id, insert some wellbeing scores, then run test
        id => insertWellbeings(id, wellbeings(id), test)
      )
    )
  }),
  it('should get a user\s last 5 wellbeings with limit larger than max (50)', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings?limit=9999')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(10)
            expect(res.body.results[1].wellbeing).to.eql(9)
            expect(res.body.results[2].wellbeing).to.eql(8)
            expect(res.body.results[3].wellbeing).to.eql(7)
            expect(res.body.results[4].wellbeing).to.eql(6)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(
      // Insert a user
      () => insertUser(testEmail, passwordHash,
        // Pass user id, insert some wellbeing scores, then run test
        id => insertWellbeings(id, wellbeings(id), test)
      )
    )
  }),
  it('should get a user\s last 10 wellbeings with limit of 10 specified', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings?limit=10')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end((_, res) => {
            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(10)
            expect(res.body.results[1].wellbeing).to.eql(9)
            expect(res.body.results[2].wellbeing).to.eql(8)
            expect(res.body.results[3].wellbeing).to.eql(7)
            expect(res.body.results[4].wellbeing).to.eql(6)
            expect(res.body.results[5].wellbeing).to.eql(5)
            expect(res.body.results[6].wellbeing).to.eql(4)
            expect(res.body.results[7].wellbeing).to.eql(3)
            expect(res.body.results[8].wellbeing).to.eql(2)
            expect(res.body.results[9].wellbeing).to.eql(1)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(
      // Insert a user
      () => insertUser(testEmail, passwordHash,
        // Pass user id, insert some wellbeing scores, then run test
        id => insertWellbeings(id, wellbeings(id), test)
      )
    )
  })
})
