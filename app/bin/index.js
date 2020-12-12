const fs = require('fs');
const path = require('path');

console.log(fs.readFileSync(path.join(__dirname, '../dist/assets/a.txt')).toString('utf-8'))
console.log(path.join(__dirname, '../dist/assets/a.txt'))