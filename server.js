var express = require("express");
var app = express();

// Use CORS so FCC can test stuff.
var cors = require('cors');
app.use(cors());

// Link up public folder for .css stylesheet.
app.use(express.static("public"));


// From the current working directory (CWD), send the index page.
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });


/*test */
app.route('/test')
    .get(function(req, res) {
	res.send('working');
    });

// Listen on port 3000.
app.listen(process.env.PORT || 3000, function () {
  console.log('server.js is listening on port 3000');
});
