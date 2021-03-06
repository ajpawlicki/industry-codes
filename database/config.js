const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/industry-codes';
mongoose.connect(mongoURI);
console.log('mongoURI:', mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongodb connection open');
});

module.exports.mongoose = mongoose;
module.exports.db = db;