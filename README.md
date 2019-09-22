# node-auth-kit

A starter boiler plate for node application with authentication, which includes Google, Facebook and Local - email/password authentication strategies using passport.js &amp; JWT.

## Getting Started

1. ### Clone the repo using
```git clone https://github.com/soha-moosa/node-auth-kit.git```

2. ### Installation

- Run `npm install` to install all project dependencies available in package.json file.

3. ### Add nodemon.json

- Add nodemon.json file with your data at your root directory.

```{
  "env": {
    "Node_ENV": "", // Add your development environment mode
    "PORT": , // Server will listen at this PORT
    "SECRET": "", // Add SECRET to be used in sessions or jwt
    "MONGODB_URI": "", // Add your mongodb database connection URL here
    "SEND_GRID_API_KEY": "", // Add your send grid api key here
    "JWT_SUBJECT": "", // Add subject to be used in JWT options
    "FACEBOOK_APP_ID": "", // Add your facebook app id here process is defined below
    "FACEBOOK_APP_SECRET": "", // Add your facebook app secret here process is defined below
    "GOOGLE_CLIENT_ID": "", // Add your google client id here process is defined below
    "GOOGLE_CLIENT_SECRET": "" // Add your google client secret here process is defined below
  }
}
```

4. ### Development mode

- Having everything installed run `npm start`. This command will start your server using nodemon.json as included in the package.json file.

## Facebook App

* To get `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` you need to go to [facebook for developers](https://developers.facebook.com)
* Go to MyApps and Create App
* After creating your app go to Settings and then Basic option to get your App ID and App Secret

## Google App

* To get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` you need to go to [google developers console](https://console.developers.google.com)
* From the top add new project.
* After creating your app enable Google+ API and then go to Credentials option to get your Client ID and Client Secret

## Features

* You can Signup a user using email and password. Confirm Password is also added for validation.
* You can Login a user using email and password.
* You can Signup a user using Facebook Account.
* You can Signup a user using Gmail Account.

## License

MIT License

Copyright (c) 2019 Soha Moosa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
