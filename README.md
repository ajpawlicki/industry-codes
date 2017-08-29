# industry-codes
Look up data on insurance industry codes based off the following types: NCCI, NAICS, CA (WCIRB).<br>

## Getting Started
### Installing Dependencies
In your root directory run, `npm install`.

### Development
In your root directory run, `npm run start`.

### Deployment
App is currently deployed at https://industry-codes.herokuapp.com/.

## How To Use
* Select the code type in the dropdown menu.
* Input the code value that you are looking for in the input box to the right of the dropdown.
* Submit form.
* Data will return in a list format underneath the form.
* If there is no relevant data, a message will display indicating there is no data for that code.

## API
Make a get request to the api in order to get data on a particular code. The route takes two params and looks like this: '/api/codes/type/:type/code/:code'. Code value is a subcategory of code type. Examples of types include NCCI, NAICS, CA WC, etc. The code value is a string of digits with the length depending on the type. Most code types, such as NCCI and CA WC, are 4 digits, but NAICS codes are 6 digits. The result returns an array of objects with mapping and description that pertain to that particular type and code.

## To do
* Figure out how to accurately populate blank cells in pdf.
* Add styling.