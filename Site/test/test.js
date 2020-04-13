var chai = require("chai"),
	chaiHttp = require("chai-http");

var expect = chai.expect;

var app = require("../app");
// var app = "http://localhost:8080";

chai.use(chaiHttp);

describe("Un-auth Routes Unit Test", function () {
	it("should return home page", function (done) {
		chai
			.request(app)
			.get("/")
			.end(function (err, res) {
				// First check to see if the status code is correct
				expect(res).to.have.status(200);

				// Next we make sure that it is returning the correct page.
				expect(res.text).to.include("<title>Landing Page</title>");

				// Next check if session variables are accesable & check logged in state
				if (res.session) expect(res.session.loggedIn).to.equal(false);
				// TODO: add tests for logged in state

				done();
			});
	});

	it("should return event page", function (done) {
		chai
			.request(app)
			.get("/event/1")
			.end((err, res) => {
				// First check status code
				expect(res).to.have.status(200);
				// Next we make sure that it is returning the correct page.
				expect(res.text).to.include("<title>Event Page</title>");

				// TODO: add test to check if info is passed correctly to the page
				done();
			});
	});
});

describe("Authorized Routes Unit Test", function () {
	// Create agent to handle session cookies
	var agent = chai.request.agent(app);

	it("should deny login attempt", function (done) {
		agent
			.post("/login")
			.send({ username: "test_username", password: "123321" })
			.then((res) => {
				expect(res).to.have.cookie("sessionid");
				done();
			});
	});

	it("should create an account", function (done) {
		agent
			.post("/create/user")
			.send({
				name: "johnny doe",
				username: "test_user",
				password: "a_good_password",
				email: "test_email@test.com",
			})
			.then((res) => {
				// First check status code
				expect(res).to.have.status(200);

				// Next check if user logged in
				expect(res).to.have.cookie("loggedIn").to.be.true;

				done();
			});
	});

	it("should allow this login attempt", function (done) {
		agent
			.post("/login")
			.send({ username: "good_username", password: "a_good_password" })
			.then((res) => {
				expect(res).to.have.cookie("sessionid");
				done();
			});
	});

	it("should ");
});
