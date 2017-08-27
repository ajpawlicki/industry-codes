'use strict';

const Code = require('../../database/Code.js');

module.exports.getCodes = (req, res) => {
  const type = req.params.type;
  const code = req.params.code;

  const search = {};
  search[type] = code;

  Code.find(search).then(codes => {
    // console.log('codes: ', codes);
    res.send(codes);
  });
};