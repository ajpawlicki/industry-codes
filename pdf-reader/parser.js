const pdfreader = require('pdfreader');
const filepath = '/assets/test_codes.pdf'

let rows = {}; // indexed by y-position

function printRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => console.log((rows[y] || []).join(' | ')));
};

new pdfreader.PdfReader().parseFileItems(__dirname + filepath, function(err, item){
  if (!item || item.page) {
    const matrix = generateMatrix(rows);

    if (matrix) {
      matrix.pop();
      handleTextOverFlow(matrix);
    }
    console.log(matrix);

    // end of file, or page
    printRows();
    console.log('PAGE:', item.page);
    rows = {}; // clear rows for next page
  }
  if (item.text) {
    // accumulate text items into rows object, per line
    (rows[item.y] = rows[item.y] || []).push(item.text);
  }
});

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
    }
  }
};

function unshiftMissingCells(rows) {
  for (let row in rows) {
    while (rows[row].length < 13) {
      rows[row].unshift('');
    }
  }
};