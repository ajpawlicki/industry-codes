'use strict';

window.onload = () => {
  let typeInput = document.getElementById('type-input');
  let codeInput = document.querySelector('#code-input');
  let codeList = document.getElementById('code-list');
  let form = document.querySelector('form');
  let trimmedInputValue;
  
  codeInput.setAttribute('autocomplete', 'off');
  
  const addToList = (arr, list) => {
    arr.forEach((item) => {
      let listItem = document.createElement('li');

      listItem.innerHTML = `
        <div>SIC: ${item.SIC}</div>
        <div>NAICS: ${item.NAICS}</div>
        <div>General Description: ${item.General_Description}</div>
        <div>NCCI: ${item.NCCI}</div>
        <div>CA WC: ${item.CA_WC}</div>
      `;
      list.appendChild(listItem);
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    trimmedInputValue = codeInput.value.trim();

    codeList.innerHTML = '';
    codeInput.value = ''

    if (trimmedInputValue.length > 0) {
      $.get(`/api/codes/type/${typeInput.value}/code/${trimmedInputValue}`, (codes) => {
        if (codes.length > 0) {
          addToList(codes, codeList);
        } else {
          codeList.innerHTML = 'There is no data for that code.';
        }
      });
    } else {
      codeList.innerHTML = 'Please enter a value in the input box.';
    }

  });
};