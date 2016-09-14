import request from 'supertest';

var that = {};

that.authenticate = (_server) => {
  return new Promise(resolve => {
    request(_server)
      .post('/user/login')
      .send({
        "username": "admin",
        "password": "admin"
      })
      .end((err, res) => {
        resolve(res.body.id_token);
      });
  });
};

that.authenticatedRequest = (_server, _request, _resolve) => {
  return that.authenticate(_server)
    .then((token) => {
      _request
        .set('Authorization', 'Bearer ' + token)
        .end(_resolve);
    });
};

module.exports = that;