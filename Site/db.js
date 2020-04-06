var { Client } = require("pg");

// FIXME: Need to edit this to once we create a postgres database

// const client = new Client({
// 	user: "dbuser",
// 	host: "database.server.com",
// 	database: "mydb",
// 	password: "secretpassword",
// 	port: 3211,
// });

const client = new Client();

// Create a new database instance using the config above
var db = client.connect();

module.exports = db;
