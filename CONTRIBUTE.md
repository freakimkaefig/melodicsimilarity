# Contribute
## Prerequisites
1. Install [Node.js](https://nodejs.org) (version >= 5.3.0)
2. Install [Java](https://www.java.com/de/download/) (version >= 8)
3. `$ npm install webpack -g`
4. `$ npm install nodemon -g`

## Start
1. Fork it
2. `$ npm install`
3. `$ npm run build-dev`
4. Create your feature branch (`$ git checkout -b my-new-feature`)
5. Commit your changes (`$ git commit -am 'Added some feature'`)
6. `$ npm test`
7. Push to the branch (`$ git push origin my-new-feature`)
8. Create new Pull Request

## Setup MongoDB database
You'll need a MongoDB database running. You can host free ones on [MongoLab](https://www.mlab.com).

Put your connect uri in a file `.env.js` in projects root. Also put the app base url in there.

Example:
```
# .env.js

module.exports = {
  BASE_URL: 'http://localhost:3000',
  MONGO_URI: 'mongodb://<dbuser>:<dbpassword>@ds013260.mlab.com:13260/<dbname>'
};
```

## Express webserver
Run `$ npm run dev-server` for nodemon version, or `$ node start` for standard server.

The output should be something like this:
```
> melodicsimilarity@1.0.0 dev-server path/to/your/working/copy
> nodemon bin/www

[nodemon] 1.9.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node bin/www`
```

The project url is [http://localhost:3000](http://localhost:3000).

## Apache Solr
Run `$ solr/bin/solr start` from the project root.

The output should be something like this:
```
Backing up path/to/your/working/copy/solr/server/logs/solr.log
        1 file(a) moved.
Backing up path/to/your/working/copy/solr/server/logs/solr_gc.log
        1 file(s) moved.
Waiting up to 30 to see Solr running on port 8983
Started Solr server on port 8983. Happy searching!
```
---
Stopping Apache Solr: `$ solr/bin/solr stop -all`.

The output should say:
```
Stopping Solr process 2436 running on port 8983
```

## Structure
The app is structured in frontend and backend. The backend part is in `app.js`, the frontend part is in `public/`, which is also the webroot.
```
melodicsimilarity
 ├── bin/
 │   └── www                     # The webserver (start with: npm start or npm run dev-server)
 ├── config/                     # 3rd party config files
 ├── controllers/                # express server controllers
 ├── examples/                   # Example files for testing
 ├── lib/                        # Libraries that aren't on npm
 ├── node_modules/               # 3rd-party build tools and utilities
 ├── public/                     # The webroot
 │   └── build/                  # WebPack builds dependencies in here
 ├── routes/
 │   └── index.js                # Webserver routes are defined here
 ├── src/                        # Project structure for `Flux Application Architecture`
 │   ├── actions/
 │   ├── components/
 │   ├── constants/
 │   ├── dispatcher/
 │   ├── stores/
 │   ├── stylesheets/
 │   ├── App.js                  # Renders main page layout
 │   ├── common.js               # Common dependencies (jquery, bootstrap)
 │   ├── index.js                # Entry point for index page
 │   └── Root.js                 # Router from `react-router`
 ├── test/                       # Test directory
 ├── views/                      # Jade view templates
 ├── .babelrc
 ├── .gitignore
 ├── .travis.yml
 ├── app.js                      # Main express server script
 ├── CONTRIBUTE.md               # You are here
 ├── LICENSE                     # MIT open source license
 ├── package.json                # The list of 3rd party build tools and utilities
 ├── README.md
 └── webpack.config.json
```

## Testing
I'm using [mocha](https://mochajs.org/) and [should](https://shouldjs.github.io/) for testing.
Run the test suite with:

`$ npm test`

The `test` script starts Express webserver, so port `3000` shouldn't be in use. Apache Solr isn't yet covered in tests.

# Docker
Add mongo container with `$ docker run --name melodicsimilarity-mongo -d mongo --auth`.

Start MongoDB shell & create db user:
```
$ docker exec -it melodicsimilarity-mongo mongo admin
MongoDB shell version: 3.2.5
connecting to: admin
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
        http://docs.mongodb.org/
Questions? Try the support group
        http://groups.google.com/group/mongodb-user
> db.createUser({ user: 'username', pwd: 'password', roles: [ { role: "userAdminAnyDatabase", db: "admin"} ] });
Successfully added user: {
        "user" : "username",
        "roles" : [
                {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin"
                }
        ]
}
```

Create database:
```
$ docker run -it --rm --link melodicsimilarity-mongo:mongo mongo mongo -u username -p password --authenticationDatabase admin melodicsimilarity-mongo/melodicsimilarity-db
```

Stop db container with `$ docker stop db`.