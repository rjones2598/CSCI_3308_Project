// Export a function, so that we can pass
// the app and io instances from the app.js file:

module.exports = function(app) {
	app.get("/", function(req, res) {
		console.log("GET: /");
		// Render views/home.html
		if (req.session.loggedIn) {
			// Find events based on user
			let events_query =
				"SELECT * FROM table_name WHERE category=(SELECT categories FROM user_table WHERE id=" +
				req.session.user_id +
				")";
			// Render page with db data
		}
		res.render("LandingPage");
	});

	app.get("/event/:id", function(req, res) {
		console.log("GET: /event/:id");
		// console.log(req.params.id);

		let event_query =
			"SELECT * FROM table_name WHERE event_id=" + req.params.id;

		res.render("ExampleEventPage");
	});

	app.post("/login", function(req, res) {
		console.log("POST: login");

		if (!req.session.loggedIn) {
			// get password from db
			let db_pass = "";
			// hash req.body.password
			let hashed_pass = "";
			// compare hashed and db password
			if (db_pass == hashed_pass) {
				console.log("login successful");
				// Set session variable that can be used in other routes
				// req.session.username
				// req.session.user_id
				// req.session.email

				req.session.loggedIn = true;
				res.render("/");
			} else {
				console.log("login failed");
				req.session.loggedIn = false;
				res.render("login");
			}
		} else {
			console.log("Already logged in!");
			res.render("/");
		}
	});

	app.get("/user/:user_id", function(req, res) {
		// Route protected by restrict_user function
		console.log("GET: user/:user_id");

		let user_query = "SELECT * FROM table_name WHERE id=" + req.params.user_id;

		res.render("profilepage");
	});

	app.get("/user/:user_id/prefs", function(req, res) {
		// Route protected by restrict_user function
		console.log("GET: user/:user_id/prefs");
		// console.log(req.params.user_id);

		res.render("UserPref");
	});

	app.post("/user/:user_id/prefs", function(req, res) {
		// Route protected by restrict_user function
		console.log("POST: user/:user_id/prefs");
		console.log(req);

		res.render("UserPref");
	});
};
