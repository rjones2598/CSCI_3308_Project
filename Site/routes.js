// Export a function, so that we can pass
// the app and io instances from the app.js file:
// import { compare, hash as _hash } from "bcrypt";
var { compare, hash } = require("bcrypt");
const saltRounds = 10;

module.exports = function (app, db) {
	app.get("/", function (req, res) {
		// Render views/home.html

		// Find events based on user
		// && operator checks to see if arrays have elements in common
		let events_query = req.session.loggedIn
			? `SELECT * FROM events WHERE category&&(SELECT categories FROM user_table WHERE user_id=${req.body.user_id});`
			: "SELECT * FROM events;";

		let cat_query = "SELECT * FROM prefs;";

		db.task((t) => {
			return t.batch([t.any(events_query), t.any(cat_query)]);
		})
			.then((info) => {
				res.render("LandingPage", {
					eventData: info[0],
					categData: info[1],
				});
			})
			.catch((err) => {
				console.log("error", err);
				res.render("LandingPage", {
					eventData: "",
					categData: "",
				});
			});
	});

	////////////////////////////////////////////
	///////////// EVENT ROUTES ////////////////
	///////////////////////////////////////////

	app.get("/event/:id", function (req, res) {
		let event_query = `SELECT * FROM events WHERE event_id=${req.params.id};`;

		db.all(event_query)
			.then((events) => {
				console.log(events);
				// TODO: Render page with db data
				res.render("ExampleEventPage");
			})
			.catch((error) => {
				console.log("Error Connecting to db, rendering static page", error);
				res.render("ExampleEventPage.html");
			});
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
		console.log(req.session.loggedIn);
		if (!req.session.loggedIn) {
			let user_query = `SELECT * FROM users WHERE username='${req.body.username}';`;

			db.one(user_query)
				.then((all_data) => {
					// 	console.log(all_data);

					// Load hash from your password DB.
					let db_pass = all_data.password;

					compare(req.body.password, db_pass, function (err, result) {
						// result == true
						if (result) {
							console.log("login successful");
							// Set session variable that can be used in other routes
							req.session.username = all_data.username;
							req.session.user_id = all_data.user_id;
							req.session.email = all_data.email;
							req.session.loggedIn = true;

							// TODO: Render Home page, Possibly send user logged in state too?
							res.render("profilepage");
						} else {
							console.log("login failed");
							req.session.loggedIn = false;
							res.render("login");
						}
					});
				})
				.catch((err) => {
					if (err.code == 0) {
						console.log("Username not found");
					} else {
						console.log("Error Unknown", err);
					}
					res.redirect("/");
				});
		} else {
			console.log("Already logged in!");
			// TODO: Render Home page, Possibly send user logged in state too?
			res.redirect("/");
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
		// Hash Password using bcrypt
		hash(req.body.password, saltRounds, function (err, _hash) {
			if (err) {
				console.log("Error Hashing password", err);
				res.redirect("/");
			}
			let new_user_query = `INSERT INTO users (username, firstname, lastname, password, email) VALUES ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${_hash}', '${req.body.email}') ON CONFLICT DO NOTHING;`;

			db.any(new_user_query)
				.then((info) => {
					db.one(
						`SELECT user_id FROM users WHERE email=${req.body.email}`
					).then((user_id) => {
						req.session.username = req.body.username;
						req.session.user_id = user_id;
						req.session.email = req.body.email;
						req.session.loggedIn = true;

						console.log("New user added");
						res.render("UserPref");
					});
				})
				.catch((err) => {
					console.log("User not added to database: Error: ", err);
					res.redirect("/");
				});
		});
	});

	app.get("/user/:user_id", function (req, res) {
		// Route protected by restrict_user function

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

		// User should already be logged in if they are accessing this route
		// username = req.session.username;
		// let update_query = "INSERT INTO table_name prefs VALUES $1 WHERE username = $2;";
		// TODO: write db query once db is functional

		// What page should be rendered after updating prefs?
		res.render("UserPref");
	});
};
