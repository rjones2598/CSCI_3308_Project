// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app){
  
	app.get('/', function(req, res){
		// Render views/home.html
		res.render('LandingPage');
	});

};
