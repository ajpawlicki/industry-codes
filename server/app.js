'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

require('../pdf-reader/parser.js')(); // parse pdf and add to db
const getCodes = require('./handlers/handlers.js').getCodes;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../client/dist'));

app.get('/api/codes/type/:type/code/:code', getCodes);

const port = process.env.PORT || 3000;

app.listen(port);
console.log(`Listening on port ${port}`);