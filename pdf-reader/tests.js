module.exports.checkTextForTrailingChar = function(matrix) {
  let text;

  const trailingChars = {
    ' ': true,
    '-': true
  };

  for (let row of matrix) {
    text = row[2];
    if (trailingChars[text[text.length - 1]] === true) {
      throw new Error('Text contains trailing space or dash.');
    }
  }
};

module.exports.checkRowLength = function(matrix, size) {
  for (let row of matrix) {
    if (row.length !== size) {
      throw new Error(`Row is not correct size of ${size}.`);
    }
  }
};