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
  })
})
