// Export a function, so that we can pass
// the app and io instances from the app.js file:

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (app, db) {
	app.get("/", function (req, res) {
		console.log("GET: /");
		// Render views/home.html
		if (req.session.loggedIn) {
			// Find events based on user

			// && operator checks to see if arrays have elements in common
			// FIXME: Change table_name & update query
			let events_query =
				"SELECT * FROM table_name WHERE category&&(SELECT categories FROM user_table WHERE user_id=$1);";

			db.query(events_query, req.session.user_id)
				.then((events) => {
					console.log(events);
					// TODO: Render page with db data
					res.render("LandingPage");
				})
				.catch((error) => {
					console.log(error);
					// Render page without db data
					res.render("LandingPage");
				});
		}
		// Render page without db data
		res.render("LandingPage");
	});

	////////////////////////////////////////////
	///////////// EVENT ROUTES ////////////////
	///////////////////////////////////////////

	app.get("/event/:id", function (req, res) {
		console.log("GET: /event/:id");
		// console.log(req.params.id);

		// FIXME: Change table_name & update query
		let event_query = "SELECT * FROM table_name WHERE event_id=$1;";

		// TODO: Once db is setup, uncomment lines below
		// db.query(event_query, req.params.id)
		// 	.then((events) => {
		// 		console.log(events);
		// 		// TODO: Render page with db data
		// 		res.render("ExampleEventPage");
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 		res.render("ExampleEventPage");
		// 	});
		res.render("ExampleEventPage");
	});

	app.post("/event/:id/comment", function (req, res) {
		console.log("POST: event/:id/comment");

		if (req.session.loggedIn) {
			let comment_query = "INSERT INTO table_name (comment, username)";
			// TODO: write the db insert function
		} else {
			console.log("user is not logged in");
			// TODO: Redirect to login?
			res.render("/");
		}
	});

	app.post("/event/:id/attending", function (req, res) {
		console.log("POST: event/:id/attending");

		if (req.session.loggedIn) {
			// req.session.user_id
			// Query is built to append user id to attending array
			// TODO: Check if this query will actually work
			let attending_query = `UPDATE event_table SET attending = attending || '{$1}' \
									WHERE event_id = $2 \
									AND NOT EXITS (SELECT $1 = ANY ('attending'::int[]));`;
		} else {
			console.log("user is not logged in");
			// TODO: Redirect to login?
			res.render("/");
		}
	});

	//////////////////////////////////////////
	///////////// USER ROUTES ////////////////
	//////////////////////////////////////////

	app.post("/login", function (req, res) {
		console.log("POST: login");

		if (!req.session.loggedIn) {
			// FIXME: Change table_name & update query
			let password_query = "SELECT * FROM table_name WHERE username=$1;";

			// TODO: Once db is setup uncomment query below
			// db.query(password_query, req.body.password).then((all_data) => {
			// 	console.log(all_data);

			// 	// Load hash from your password DB.
			// 	let db_pass = all_data.password;

			// 	bcrypt.compare(req.body.password, db_pass, function (err, result) {
			// 		// result == true
			// 		if (result) {
			// 			console.log("login successful");
			// 			// Set session variable that can be used in other routes
			// 			req.session.username = all_data.username;
			// 			req.session.user_id = all_data.user_id;
			// 			req.session.email = all_data.email;
			// 			req.session.loggedIn = true;

			// 			// TODO: Render Home page, Possibly send user logged in state too?
			// 			res.render("/");
			// 		} else {
			// 			console.log("login failed");
			// 			req.session.loggedIn = false;
			// 			res.render("login");
			// 		}
			// 	});
			// });
		} else {
			console.log("Already logged in!");
			// TODO: Render Home page, Possibly send user logged in state too?
			res.render("/");
		}
	});

	app.post("/logout", function (req, res) {
		if (req.session) {
			// If there is something to clear, clear it.
			req.session.username = undefined;
			req.session.user_id = undefined;
			req.session.email = undefined;
			req.session.loggedIn = false;
		} else {
			// if there is nothing to clear don't do anything
		}
		res.render("/");
	});

	app.post("/create/user", function (req, res) {
		console.log("POST: user/create");

		bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
			let new_user_query = `INSERT INTO table_name (username, password, email) \
				VALUES ($1, $2, $3) WHERE NOT EXISTS (SELECT * FROM table_name WHERE email = $3);`;

			db.query(new_user_query, req.body.username, hash, req.body.email)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log("User not added to database: Error: ", err);
				});
		});

		// TODO: add db query once db is setup
		// update session variables with new info

		res.render("UserPref");
	});

	app.get("/user/:user_id", function (req, res) {
		// Route protected by restrict_user function
		console.log("GET: user/:user_id");

		// FIXME: Change table_name & update query
		let user_query = "SELECT * FROM table_name WHERE user_id=$1;";

		// db.query(user_query, req.params.user_id)
		// 	.then((user_data) => {
		// 		console.log(user_data);
		// 		// TODO: Render page with db data
		// 		res.render("profilepage");
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 		res.render("profilepage");
		// 	});
		res.render("profilepage");
	});

	app.get("/user/:user_id/prefs", function (req, res) {
		// Route protected by restrict_user function
		console.log("GET: user/:user_id/prefs");

		// FIXME: Change table_name & update query
		const user_pref_query = "SELECT * FROM table_name WHERE user_id=$1;";

		db.query(user_pref_query, req.params.user_id)
			.then((user_data) => {
				console.log(user_data);
				// TODO: Pass user_data to profile page
				res.render("profilepage");
			})
			.catch((error) => {
				console.log(error);
				res.render("profilepage");
			});
	});

	app.post("/user/:user_id/prefs", function (req, res) {
		// Route protected by restrict_user function
		console.log("POST: user/:user_id/prefs");

		// User should already be logged in if they are accessing this route
		// username = req.session.username;
		// let update_query = "INSERT INTO table_name prefs VALUES $1 WHERE username = $2;";
		// TODO: write db query once db is functional

		// What page should be rendered after updating prefs?
		res.render("UserPref");
	});
};
