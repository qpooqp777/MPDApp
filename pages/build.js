const slugify = require('./utils/slugify');
const fs = require('fs');
const qs = slugify('some string');

fs.writeFile(
  'questionsDB.js',
  `module.exports = ${JSON.stringify(qs, null, 2)}`,
  (err) => {
    if (err) throw err;
    console.log('file created successfully!');
  }
);
