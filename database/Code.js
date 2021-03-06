const mongoose = require('./config.js').mongoose;
const db = require('./config.js').db;

const codeSchema = mongoose.Schema({
  SIC: String,
  NAICS: String,
  General_Description: {type: String, unique: true, dropDups: true, required: true},
  NCCI: String,
  CA_WC: String,
  DE_WC: String,
  MI_WC: String,
  NJ_WC: String,
  NY_WC: String,
  PA_WC: String,
  TX_WC: String
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;