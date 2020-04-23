// This is the main file of our chat app. It initializes a new
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'node app.js' in your terminal

var express = require("express"),
	app = express();

var db = require("./db");
var port = process.env.PORT || 8080;
var env = process.env.NODE_ENV || "dev";

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.

require("./config")(app, env);
require("./routes")(app, db);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


console.log("Your application is running on http://localhost:" + port);
module.exports = app.listen(port);
