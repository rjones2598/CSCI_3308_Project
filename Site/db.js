var pg = require("pg-promise")();

const dbConfig = {
	user: "postgres",
	host: "localhost",
	database: "site_db",
	password: "passwd",
	port: 3211,
};

// Create a new database instance using the config above
var db = pg(dbConfig);

module.exports = db;
