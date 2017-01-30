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
    [id, 7],
    [id, 8],
    [id, 9],
    [id, 10],
    [id, 11],
    [id, 12],
    [id, 13],
    [id, 14],
    [id, 15],
    [id, 16]
  ]
}

const mappedWellbeings = raw => {
  switch (raw) {
    case 7:
      return 7
    case 8:
      return 9.51
    case 9:
      return 11.25
    case 10:
      return 12.4
    case 11:
      return 13.33
    case 12:
      return 14.08
    case 13:
      return 14.75
    case 14:
      return 15.32
    case 15:
      return 15.84
    case 16:
      return 16.36
  }
}

describe('Wellbeing endpoint', () => {
  it('should get a user\s last 5 wellbeings with limit specified', done => {
    const test = id => {
      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.get('/v1/users/' + id + '/wellbeings?limit=5')
          .set('Authorization', 'Bearer ' + token)
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(mappedWellbeings(16))
            expect(res.body.results[1].wellbeing).to.eql(mappedWellbeings(15))
            expect(res.body.results[2].wellbeing).to.eql(mappedWellbeings(14))
            expect(res.body.results[3].wellbeing).to.eql(mappedWellbeings(13))
            expect(res.body.results[4].wellbeing).to.eql(mappedWellbeings(12))

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
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(mappedWellbeings(16))
            expect(res.body.results[1].wellbeing).to.eql(mappedWellbeings(15))
            expect(res.body.results[2].wellbeing).to.eql(mappedWellbeings(14))
            expect(res.body.results[3].wellbeing).to.eql(mappedWellbeings(13))
            expect(res.body.results[4].wellbeing).to.eql(mappedWellbeings(12))

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
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(mappedWellbeings(16))
            expect(res.body.results[1].wellbeing).to.eql(mappedWellbeings(15))
            expect(res.body.results[2].wellbeing).to.eql(mappedWellbeings(14))
            expect(res.body.results[3].wellbeing).to.eql(mappedWellbeings(13))
            expect(res.body.results[4].wellbeing).to.eql(mappedWellbeings(12))

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
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(mappedWellbeings(16))
            expect(res.body.results[1].wellbeing).to.eql(mappedWellbeings(15))
            expect(res.body.results[2].wellbeing).to.eql(mappedWellbeings(14))
            expect(res.body.results[3].wellbeing).to.eql(mappedWellbeings(13))
            expect(res.body.results[4].wellbeing).to.eql(mappedWellbeings(12))

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
          .end((_, res) => {
            expect(res.status).to.eql(200)

            expect(res.body.id).to.eql(id)

            expect(res.body.results[0].wellbeing).to.eql(mappedWellbeings(16))
            expect(res.body.results[1].wellbeing).to.eql(mappedWellbeings(15))
            expect(res.body.results[2].wellbeing).to.eql(mappedWellbeings(14))
            expect(res.body.results[3].wellbeing).to.eql(mappedWellbeings(13))
            expect(res.body.results[4].wellbeing).to.eql(mappedWellbeings(12))
            expect(res.body.results[5].wellbeing).to.eql(mappedWellbeings(11))
            expect(res.body.results[6].wellbeing).to.eql(mappedWellbeings(10))
            expect(res.body.results[7].wellbeing).to.eql(mappedWellbeings(9))
            expect(res.body.results[8].wellbeing).to.eql(mappedWellbeings(8))
            expect(res.body.results[9].wellbeing).to.eql(mappedWellbeings(7))

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
  it('should post a user\s wellbeing', done => {
    const test = id => {
      const postData = {
        wellbeing: 12
      }

      jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
        request.post('/v1/users/' + id + '/wellbeings')
          .set('Authorization', 'Bearer ' + token)
          .send(postData)
          .end((_, res) => {
            expect(res.status).to.eql(201)
            expect(res.headers.location).to.eql(
              '/v1/users/' + res.body.user_id + '/wellbeings?limit=1'
            )

            expect(res.body.user_id).to.eql(id)
            expect(res.body.wellbeing).to.eql(
              mappedWellbeings(postData.wellbeing)
            )

            const time = new Date(res.body.date_recorded).getTime() / 1000
            const now = new Date().getTime() / 1000

            expect(time).to.be.at.most(now)

            done()
          })
      })
    }

    // Empty db
    runOnEmptyDB(() => insertUser(testEmail, passwordHash, test))
  }),
  it('should reject posting a user\s wellbeing with id of non existent user', done => {
    const id = 9999

    const postData = {
      wellbeing: 20
    }

    jwt.sign({ id: id, exp: expiry }, secret, {}, (_, token) => {
      request.post('/v1/users/' + id + '/wellbeings')
        .set('Authorization', 'Bearer ' + token)
        .send(postData)
        .end((_, res) => {
          expect(res.status).to.eql(404)

          expect(res.body.error).to.eql('No user found with this id')

          done()
        })
    })
  })
})
