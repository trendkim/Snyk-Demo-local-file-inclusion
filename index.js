const path = require('path');
const express = require('express');
const debug = require('debug')('local-file-inclusion');

const app = express();

// By using express.static middleware Path injections can be filtered
// http://localhost:5050/lfi-protected/test-static.json (File intended for sharing)
// http://localhost:5050/lfi-protected/..%2Ftest.json (Trying to access parent directory returns 404)
// Activating debug returns the following log
// 'send malicious path "../test.json"'
app.use('/lfi-protected', express.static('static'));

app.listen(5050, () => {
  debug('Server started on 5050');
});

app.get('/lfi/:filePath', (req, res) => {

  // The following queries allow to access files other than the intended
  // http://localhost:5050/lfi/test.json (File intended for sharing)
  // http://localhost:5050/lfi/index.js (Access file running the server code)
  // http://localhost:5050/lfi/..%2Ftest.json (Access files in the parent directory)
  // http://localhost:5050/lfi/..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd (To access /etc/passwd file)

  const filePath = path.resolve(req.params.filePath);
  debug(`Path : ${filePath}`);

  res.sendFile(filePath);
})