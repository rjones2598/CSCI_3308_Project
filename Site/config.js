// This file handles the configuration of the app.
// It is required by app.js

var session = require("express-session");
var bodyParser = require("body-parser");

module.exports = function (app, env) {
	// Set .html as the default template extension
	app.set("view engine", "ejs");
	// Initialize the ejs template engine
	app.engine("html", require("ejs").renderFile);
	// Tell express where it can find the templates
	app.set("views", __dirname + "/views/ejs");
	// Setup express sessions. This is to allow users to login and retain that state throughout their time on the site
	if (env == "dev") {
		app.use(
			session({ secret: "change this!", saveUninitialized: true, resave: true })
		);
	} else {
		// if production enviroment throw error as we need to setup an external config file for secrets
		throw "Prod enviroment not setup";
	}

	// Add ability to parse json request body
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	// Log every request for debugging
	app.use(log_routes);
	// Set express to run the "restrict_user" function on all requests that start with /user
	app.use(restrict_user);
};

function log_routes(req, res, next) {
	console.log(req.method, ": ", req.url);
	return next();
}

function restrict_user(req, res, next) {
	if (req.url.indexOf("/user") == 0) {
		if (req.session.loggedIn) {
			console.log("User allowed to restricted user space");
			return next();
		}

		console.log("User session not logged in, redirecting");
		req.session.error = "Access denied!";
		res.redirect("/");
	}
	return next();
}
