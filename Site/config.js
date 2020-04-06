// This file handles the configuration of the app.
// It is required by app.js

var session = require("express-session");

module.exports = function (app, env) {
	// Set .html as the default template extension
	app.set("view engine", "html");
	// Initialize the ejs template engine
	app.engine("html", require("ejs").renderFile);
	// Tell express where it can find the templates
	app.set("views", __dirname + "/views/pages");
	// Setup express sessions. This is to allow users to login and retain that state throughout their time on the site
	if (env == "dev") {
		app.use(
			session({ secret: "change this!", saveUninitialized: true, resave: true })
		);
	} else {
		// if production enviroment throw error as we need to setup an external config file for secrets
		throw "Prod enviroment not setup";
	}

	// Set express to run the "restrict_user" function on all requests that start with /user
	app.use("/user", restrict_user);
};

function restrict_user(req, res, next) {
	if (req.session.loggedIn) {
		console.log("User allowed to restricted user space");
		next();
	} else {
		console.log("User session not logged in, redirecting");
		req.session.error = "Access denied!";
		res.redirect("/");
	}
}
