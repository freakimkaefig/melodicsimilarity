# melodic similarity
The app is structured in frontend and backend. The backend part is in `server/`, the frontend part is in `public/`, which is also the webroot.
```
melodicsimilarity
 ├── node_modules/                         # 3rd-party build tools and utilities
 ├── public/                               # The webroot
 │   ├── css/                              # Compiled css from source/css and source/sass
 │   │   └── style.css                     # Application styles
 │   ├── fonts/                            # Application webfonts
 │   └── js/                               # Concatenated (from /source/js) and own js
 │       ├── app.js                        # Main app file
 │       └── libs.js                       # Included, concatenated js libraries
 ├── server/                               # The express server directory
 │   └── server.js                         # The main server entry point
 ├── source/                               # The application source files
 │   ├── css/                              # Application stylesheets
 │   ├── js/                               # Global application settings
 │   └── sass/                             # Application styles sass
 │       ├── responsive.scss               # Responsive styles
 │       └── style.scss                    # Main stylesheet (entry point for sass compiler)
 ├── vendor/                               # 3rd-party components
 │   └── bower_components/                 # Download directory for bower components
 ├── .bowerrc                              # Configuration for bower
 ├── .gitignore                            # VCS ignore file
 ├── bower.json                            # The list of 3rd party components
 ├── gulpfile.js                           # Gulp tasks
 ├── LICENSE                               # MIT open source license
 ├── package.json                          # The list of 3rd party build tools and utilities
 └── Readme.md                             # You're here
```

## Start debug session
To start full debug session, simply run `gulp`.

The default gulp task triggers BrowserSync, Nodemon and Sass compiler.
