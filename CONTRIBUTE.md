# Contribute
## Prerequisites
1. Install [Node.js](https://nodejs.org) (version >= 5.3.0)
2. `npm install webpack -g`
3. `npm install nodemon -g`

## Start
1. Fork it
2. `npm install`
3. `webpack -d`
4. Create your feature branch (`git checkout -b my-new-feature`)
5. Commit your changes (`git commit -am 'Added some feature'`)
6. `npm test`
7. Push to the branch (`git push origin my-new-feature`)
8. Create new Pull Request

## Setup MongoDB database
You'll need a MongoDB database running. You can host free ones on [MongoLab](https://www.mlab.com).

Put your connect uri in a file `.env` in projects root. Also put the app base url in there.

Example:
```
# .env
BASE_URL=http://localhost:3000
MONGOLAB_URI=mongodb://<dbuser>:<dbpassword>@ds013260.mlab.com:13260/<dbname>
```

## Start express webserver
Run `npm run dev-server` for nodemon version, or `node start` for standard server.

The project url is [http://localhost:3000](http://localhost:3000).

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

`npm test`
