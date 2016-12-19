describe('Users endpoint', () => {
  it('should create and return a user', done => {
    request.post('/users')
      .send({
        email: 'test@test.com',
        password: 'testpassword'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.email).to.eql('test@test.com')

        const id = res.body.id

        expect(res.headers.location).to.eql('/users/' + id)

        done(err)
      })
  }),
  it('should not create a user if no email given', done => {
    request.post('/users')
      .send({
        password: 'testpassword'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Missing email or password field(s)')

        done(err)
      })
  }),
  it('should not create a user if no password given', done => {
    request.post('/users')
      .send({
        email: 'test@test.com'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Missing email or password field(s)')

        done(err)
      })
  }),
  it('should retrieve a user when given a valid id', done => {
    request.post('/users')
      .send({
        email: 'test@test.com',
        password: 'testpassword'
      })
      .end((err, res) => {
        const id = res.body.id
        request.get('/users/' + id)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              id: id,
              email: 'test@test.com'
            })

            done()
          })
      })
  }),
  it('should report an error for invalid user id', done => {
    request.get('/users/' + 0)
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Invalid user id')

        done()
      })
  }),
  it('should report an error for invalid user id type', done => {
    request.get('/users/invalid')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).to.eql('Invalid user id')

        done()
      })
  })
})
