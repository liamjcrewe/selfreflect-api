import supertest from 'supertest'
import chai from 'chai'
import app from '../build/index.js'

global.app = app
global.expect = chai.expect
global.request = supertest(app)
