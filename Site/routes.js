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

		db.any(event_query)
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
		// console.log(req.session.loggedIn);
		if (!req.session.loggedIn) {
			console.log(req.body.loginUsername);

			let user_query = `SELECT * FROM users WHERE username='${req.body.loginUsername}';`;

			db.one(user_query)
				.then((all_data) => {
					// 	console.log(all_data);

					// Load hash from your password DB.
					let db_pass = all_data.password;

					compare(req.body.loginPassword, db_pass, function (err, result) {
						// result == true
						if (result) {
							console.log("login successful");
							// Set session variable that can be used in other routes
							req.session.username = all_data.username;
							req.session.user_id = all_data.user_id;
							req.session.email = all_data.email;
							req.session.loggedIn = true;

							let events_query = `SELECT * FROM events WHERE category_id&&(SELECT prefs FROM users WHERE user_id=${req.body.user_id});`;
							let cat_query = "SELECT * FROM prefs;";

							db.task((t) => {
								return t.batch([t.any(events_query), t.any(cat_query)]);
							})
								.then((data) => {
									res.render("profilepage", {
										eventData: data[0],
										categData: data[1],
									});
								})
								.catch((err) => {
									console.log(err);

									res.render("profilepage", { eventData: "", categData: "" });
								});
						} else {
							console.log("login failed");
							req.session.loggedIn = false;
							res.redirect("/");
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
		console.log("HERE");
		// Hash Password using bcrypt
		console.log("Starting to hash password");

		var passwd = req.body.signupPass1;

		hash(passwd, saltRounds, function (err, _hash) {
			if (err) {
				console.log("Error Hashing password", err);
				res.redirect("/");
			}
			console.log("hashed password.");
			let new_user_query = `INSERT INTO users (username, firstname, lastname, password, email) VALUES ('${req.body.signupUsername}', '${req.body.signupNameFirst}', '${req.body.signupNameLast}', '${_hash}', '${req.body.signupEmail}') ON CONFLICT DO NOTHING;`;

			db.any(new_user_query)
				.then((info) => {
					db.one(
						`SELECT user_id FROM users WHERE email='${req.body.signupEmail}'`
					)
						.then((user_id) => {
							req.session.username = req.body.signupUsername;
							req.session.user_id = user_id["user_id"];
							req.session.email = req.body.signupEmail;
							req.session.loggedIn = true;

							console.log("New user added");
							res.redirect(`/user/prefs`);
						})
						.catch((err) => {
							console.log("Error fetching user data after insert", err);
							res.redirect("/");
						});
				})
				.catch((err) => {
					console.log("User not added to database: Error: ", err);
					res.redirect("/");
				});
		});
	});

	app.get("/user/prefs", function (req, res) {
		// Route protected by restrict_user function

		const user_pref_query = `SELECT prefs FROM users WHERE user_id=${req.session.user_id};`;

		db.any(user_pref_query)
			.then((user_data) => {
				res.render("UserPref", { pref: user_data });
			})
			.catch((error) => {
				console.log("ERR", error);
				res.render("profilepage", { eventData: "", categData: "" });
			});
	});

	app.post("/user/prefs", function (req, res) {
		// Route protected by restrict_user function

		const pref_query = `UPDATE users SET prefs = ${req.body.prefs} WHERE user_id=${req.session.user_id}`;
		db.one(pref_query)
			.then((empty) => {
				console.log("Updated Prefs");
				res.redirect("/user/prefs");
			})
			.catch((err) => {
				console.log(err);
				res.redirect("/user/prefs");
			});
	});

	app.get("/ExampleEventPage.html", function (req, res) {
		res.render("ExampleEventPage.html");
	});

	app.get("/ExampleEventPage2.html", function (req, res) {
		res.render("ExampleEventPage2.html");
	});

	app.get("/ExampleEventPage3.html", function (req, res) {
		res.render("ExampleEventPage3.html");
	});

	app.get("/ExampleEventPage4.html", function (req, res) {
		res.render("ExampleEventPage4.html");
	});
	app.get("/profilepage.html", function (req, res) {
		res.render("profilepage.html");
	});
};
