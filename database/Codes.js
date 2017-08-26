const mongoose = require('./config.js').mongoose;
const db = require('./config.js').db;

const codeSchema = mongoose.Schema({
  ISO_Description: String,
  ISO_CGL: String,
  SIC: String,
  NAICS: String,
  General_Description: String,
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