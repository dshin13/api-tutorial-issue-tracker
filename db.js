var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function () {
  
  mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true}, err=>{
    if(err) console.log("Database connection error: " + err);
    else console.log("Database connection established")
  });
  
  return mongoose
}