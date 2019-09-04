const app = require('express')();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log(`Connected Successfully to MongoDB!`);
    app.listen(process.env.PORT, () => {
      console.log(`Server Running at PORT ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(`Connection Failed to MongoDB : ${err}`));
