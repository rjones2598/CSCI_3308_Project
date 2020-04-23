

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: 3211,
	database: 'site_db',
	user: 'postgres',
	password: 'passwd'
};

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));






app.get('/', function(req, res) {
	var eventQuery = 'SELECT * FROM events;';
	var categQuery = 'SELECT * FROM prefs;';

	db.task('get-everything', task => {
		return task.batch([
			task.any(eventQuery),
			task.any(categQuery)
		]);
	})
	.then(info => {
		console.log(info[0]);
		console.log(info[1]);
		res.render('ejs/LandingPage', {
			eventData: info[0],
			categData: info[1]
		})
	})
	.catch(err => {
		console.log('error', err);
		res.render('ejs/LandingPage', {
			eventData: '',
			categData: ''
		})
	});
});




app.listen(3000);
console.log('port 3000');

