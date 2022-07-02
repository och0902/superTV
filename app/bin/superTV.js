'use strict';

const app = require('../app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
   console.log(`Server is running at http://localhost:${PORT} ...`);
});