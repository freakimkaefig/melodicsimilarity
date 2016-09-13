import request from 'supertest';

var that = {};

that.authenticate = (server) => {
  return new Promise(resolve => {
    request(server)
      .post('/user/login')
      .send({
        "username": "admin",
        "password": "admin"
      })
      .end((err, res) => {
        // console.log(res.body.id_token);
        resolve(res.body.id_token);
      });
  });
};

module.exports = that;