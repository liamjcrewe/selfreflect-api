import handleDBErr from '../../build/model/error'

describe('Database error handling', () => {
  it('should handle database error and release connection', done => {
    const err = 345
    const connection = {release: _ => _}
    const connectionSpy = sinon.spy(connection, 'release')
    const callback = sinon.spy()

    handleDBErr(err, connection, callback)

    expect(callback.calledWith(err)).to.be.true
    expect(connectionSpy.called).to.be.true

    done()
  })
})
