const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://anshhmt2004_db_user:YnPtUsxSltZekO0s@avadh.m3lvpvc.mongodb.net/?appName=avadh"
  )
  .then(() => {
    console.log("Connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });