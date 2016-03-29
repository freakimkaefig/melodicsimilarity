# melodic similarity

## Start
To start with the prebuilt dependencies, clone the repo and start the node.js server by running:
```sh
git clone https://github.com/freakimkaefig/melodicsimilarity.git

cd melodicsimilarity

npm install --production

npm run build

npm server
```
The project url is [http://localhost:3000](http://localhost:3000).

## Structure
The app is structured in frontend and backend. The backend part is in `server/`, the frontend part is in `public/`, which is also the webroot.
```
melodicsimilarity
 ├── bin/
 │   └── js/                     # The webserver (start with: npm run server)
 ├── config/                     # 3rd party config files
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
 │   ├── App.js                 # Renders main page layout
 │   ├── common.js              # Common dependencies (jquery, bootstrap)
 │   ├── index.js               # Entry point for index page
 │   └── Root.js                # Router from `react-router`
 ├── views/                      # Jade view templates
 ├── .babelrc
 ├── .gitignore
 ├── app.js                      # Main express server script
 ├── LICENSE                     # MIT open source license
 ├── package.json                # The list of 3rd party build tools and utilities
 ├── Readme.md                   # You're here
 └── webpack.config.json
```

## Custom build
### Install dependencies (optional)
The dependencies are compiled to `public/` and checked into VCS. To create a new and maybe adjusted build proceed with the following steps.

Run `npm install` to install build tools and utilities.

To create build from scratch run:
```sh
webpack -d
```

### Start debug session
To start full debug session, simply run (seperate windows)
```
npm start

npm server
```
