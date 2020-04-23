function openLogIn()
{
	var lButton = document.getElementById('LoginButton');
	var sButton = document.getElementById('SignupButton');
	var lSection = document.getElementById('signInDiv');
	var sSection = document.getElementById('signUpDiv');

	lButton.classList.remove("btn-outline-primary")
	lButton.classList.add("btn-primary")
	sButton.classList.remove("btn-primary")
	sButton.classList.add("btn-outline-primary")

	lSection.classList.remove("hidden")
	sSection.classList.add("hidden")
}

function openSignUp()
{
	var lButton = document.getElementById('LoginButton');
	var sButton = document.getElementById('SignupButton');
	var lSection = document.getElementById('signInDiv');
	var sSection = document.getElementById('signUpDiv');

	sButton.classList.remove("btn-outline-primary")
	sButton.classList.add("btn-primary")
	lButton.classList.remove("btn-primary")
	lButton.classList.add("btn-outline-primary")

	sSection.classList.remove("hidden")
	lSection.classList.add("hidden")
}
