var { Client } = require("pg-promise");

// FIXME: Need to edit this to once we create a postgres database

const client = new Client({
	user: "postgres",
	host: "localhost",
	database: "site_db",
	password: "passwd",
	port: 3211,
});

const client = new Client();

// Create a new database instance using the config above
var db = client.connect();

module.exports = db;
