const jwt = require('jsonwebtoken');

// Paste your token between the quotes ↓
const token = '55c551a4e7c289902d1ffa40f0043cfb2e914220de118d0a381682ee624c2069cd0cc6aaa94d17a68feec1772b59d9ababbf3c101648a4f993ca49a343659d9e';

const decoded = jwt.decode(token);
console.log(decoded); // Shows payload (iat, exp, etc.)


if (decoded && decoded.exp) {
  console.log('Expires at:', new Date(decoded.exp * 1000).toISOString());
} else {
  console.log('No exp field found');
}
