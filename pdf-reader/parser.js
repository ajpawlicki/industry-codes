const pdfreader = require('pdfreader');
const filepath = '/assets/full_list.pdf'

const {generateMatrix, postToDB, removeISOCols, handleTextWrapping} = require('./helpers.js');
const {checkTextForTrailingChar, checkRowLength} = require('./tests');

let rows = {}; // indexed by y-position

function printRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => console.log((rows[y] || []).join(' | ')));
};

module.exports = function() {
  new pdfreader.PdfReader().parseFileItems(__dirname + filepath, function(err, item){
    if (!item || item.page) {
      const matrix = generateMatrix(rows);

      if (matrix) {
        matrix.pop(); // remove last row b/c irrelevant to data
        removeISOCols(matrix);
        handleTextWrapping(matrix);
        checkTextForTrailingChar(matrix);
        checkRowLength(matrix, 11);
        postToDB(matrix);
        // matrix.forEach((row) => console.log(row.join(' | ')));
      }

      // end of file, or page
      // printRows();
      console.log('PAGE:', item.page);
      rows = {}; // clear rows for next page
    }
    if (item.text) {
      // accumulate text items into rows object, per line
      (rows[item.y] = rows[item.y] || []).push(item.text);
    }
  });
};