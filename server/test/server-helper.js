var app = require('../app');

app.set('port', 6000);

var server = app.listen(app.get('port'), () => {
  console.log("Express server listening on port " + server.address().port);
});

module.exports = server;