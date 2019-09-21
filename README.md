# node-auth-kit

A starter boiler plate for node application with authentication, which includes Google, Facebook and Local - email/password authentication strategies using passport &amp; JWT.

## Getting Started

1. ### Installation
   ..\* Run `npm install` to install all project dependencies available in package.json file.
2. ### Add nodemon.json
   ..\* add nodemon.json file with your data

```{
  "env": {
    "Node_ENV": "",
    "PORT": ,
    "SECRET": "",
    "MONGODB_URI": "",
    "SEND_GRID_API_KEY": "",
    "JWT_SUBJECT": "",
    "FACEBOOK_APP_ID": "",
    "FACEBOOK_APP_SECRET": "",
    "GOOGLE_CLIENT_ID": "",
    "GOOGLE_CLIENT_SECRET": ""
  }
}
```

3. ### Development mode
   ..\* Having everything installed run `npm start`. This command will start your server using nodemon.json as included in the package.json file.

## Facebook App

- To get `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` you need to go to [facebook for developers](https://developers.facebook.com)

-Go to MyApps and Create App

-After creating your app go to Settings and then Basic option to get your App ID and App Secret

## Google App

- To get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` you need to go to [google developers console](https://console.developers.google.com)

-From the top add new project.

-After creating your app enable Google+ API and then go to Credentials option to get your Client ID and Client Secret

## Features

- You can Signup a user using email and password. Confirm Password is also added for validation.

- You can Login a user using email and password.

- You can Signup a user using Facebook Account

- You can Signup a user using Gmail Account
