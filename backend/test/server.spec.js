import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

const expect = chai.expect;
chai.use(chaiHttp);


describe('GET /', () => {

  it('should return status 200', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('GET /api', () => {

  it('should return status 200 and a json object in the response', function (done) {
    chai.request(server)
      .get('/api')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it('should return a json object with properties win and activateBonus in the response', function (done) {
    chai.request(server)
      .get('/api')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('win');
        expect(res.body).to.have.property('activateBonus');
        done();
      });
  });

  it('should return win sequence array in the response with length equal to the count query param ', function (done) {
    chai.request(server)
      .get('/api?count=3')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('win').with.lengthOf(3);
        done();
      });
  });
});