const postCode = require('../database/helpers.js').postCode;

module.exports.generateMatrix = function(rows) {
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

module.exports.postToDB = function(matrix) {
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

module.exports.removeISOCols = function(matrix) {
  for (let row of matrix) {
    while (row.length > 11) {
      row.shift();
    }
  }
};

module.exports.handleTextWrapping = function(matrix) {
  let row, overflow, prevRow, text;
  
  const trailingChars = {
    ' ': true,
    '-': true
  };
  
  for (let i = 0; i < matrix.length; i++) {
    row = matrix[i];

    if (row.length <= 2) {
      
      if (row.length === 2) row.shift(); // remove ISO Desc overflow
      overflow = row.shift();
      prevRow = matrix[i-1];
      text = prevRow[2];

      // Make sure overflow is meant for General Desc
      if (trailingChars[text[text.length - 1]] === true) {
        prevRow[2] += overflow;
      }
      
      matrix.splice(i, 1);
      i--;
    }
  }
};

module.exports.handleTextOverFlow = function(matrix) {
  let row, overflow, prev, str;

  const trailingChars = {
    ' ': true,
    '-': true
  };
  
  for (let i = 0; i < matrix.length; i++) {
    row = matrix[i];
    if (row.length <= 2) {
      
      while (row.length > 0) {
        overflow = row.shift();
        prev = matrix[i-1];
        
        for (let j = 0; j < prev.length; j++) {
          str = prev[j];
          if (trailingChars[str[str.length - 1]] === true) {
            prev[j] += overflow;
            break;
          }
        }
      }

      matrix.splice(i, 1);
      i--;
    }
  }
};

module.exports.unshiftMissingCells = function(matrix) {
  for (let row of matrix) {
    while (row.length < 13) {
      row.unshift(null);
    }
  }
};

module.exports.populateMissingText = function(matrix) {
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