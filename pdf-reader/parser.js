const pdfreader = require('pdfreader');
const filepath = '/assets/test_codes.pdf'

const postCode = require('../database/helpers.js').postCode;

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
        handleTextOverFlow(matrix);
        unshiftMissingCells(matrix);
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
}

function generateMatrix(rows) {
  const keys = Object.keys(rows);
  
  if (keys.length > 0) {
    const matrix = [];
    keys
      .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
      .forEach((key) => matrix.push(rows[key]));
    
    return matrix;
  } else {
    return null;
  }
};

function handleTextOverFlow(matrix) {
  let row, overflow, prev, str;
  
  for (let i = 0; i < matrix.length; i++) {
    row = matrix[i];
    if (row.length <= 2) {
      
      while (row.length > 0) {
        overflow = row.shift();
        prev = matrix[i-1];
        
        for (let j = 0; j < prev.length; j++) {
          str = prev[j];
          if (str[str.length - 1] === ' ') prev[j] += overflow;
        }
      }

      matrix.splice(i, 1);
      i--;
    }
  }
};

function unshiftMissingCells(matrix) {
  for (let row of matrix) {
    while (row.length < 13) {
      row.unshift(null);
    }
  }
};

function populateMissingText(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // iterate thru matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // if cell in row above and cell in row below are null
      if (isSafeToVisit(matrix, i-1, j) && isSafeToVisit(matrix, i+1, j) && matrix[i][j] !== null) {
        // call DFS
        DFS(matrix, i, j, matrix[i][j]);
      }
    }
  }
};

function isSafeToVisit(matrix, row, col) {
  const isValidRow = (row >= 0) && (row < matrix.length);
  const isValidCol = (col >= 0) && (col < matrix[0].length);
  return isValidRow && isValidCol && matrix[row][col] === null;
};

function DFS(matrix, row, col, text) {
  matrix[row][col] = text;
  
  if (isSafeToVisit(matrix, row-1, col)) DFS(matrix, row-1, col, text);
  if (isSafeToVisit(matrix, row+1, col)) DFS(matrix, row+1, col, text);
};

function postToDB(matrix) {
  const headers = matrix.shift().map(str => str.replace(' ', '_'));
  let codeData;

  matrix.forEach((row) => {
    codeData = row.reduce((acc, curr, index) => {
      acc[headers[index]] = curr;
      return acc;
    }, {});
        
    postCode(codeData);
  });
};