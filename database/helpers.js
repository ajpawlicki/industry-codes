'use strict';

const Code = require('./Code.js');

module.exports.postCode = (codeData) => {
  Code.create(codeData);
};