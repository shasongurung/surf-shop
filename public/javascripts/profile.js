let newPasswordValue;
let confirmationValue;
//select a form with an id- 'update-profile'
const form = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');
const submitBtn = document.getElementById('mySubmit');

function validatePasswords(message, add, remove) {
	validationMessage.textContent = message;
	validationMessage.classList.add(add);
	validationMessage.classList.remove(remove);
}
// adding listener to confirmation password input
// this event is triggered as soon as user start confirming the password
confirmation.addEventListener('input', (e) => {
	e.preventDefault();
	newPasswordValue = newPassword.value;
	confirmationValue = confirmation.value;
	if (newPasswordValue != confirmationValue) {
		// call validatePasswords function, assign message, add and remove class name accordingly, also submit button too
		validatePasswords('Password must match!', 'color-red', 'color-green');
		submitBtn.setAttribute('disabled', true);
	} else {
		validatePasswords('Password match!', 'color-green', 'color-red');
		submitBtn.removeAttribute('disabled');
	}
});

//add listener in form
// incase user clicks on submit button wihtout matching confirmation value
// display flash message
form.addEventListener('submit', (e) => {
	if (newPasswordValue != confirmationValue) {
		// prevent default behaviour first
		// i.e. in this case stops submit submission event
		e.preventDefault();
		// check if the error alread exist
		const error = document.getElementById('error');
		// if not then create an error
		if (!error) {
			// create an h1 element
			const flashErrorH1 = document.createElement('h1');
			// add color-red  class
			flashErrorH1.classList.add('color-red');
			// now add an attribute id and assign error to it
			flashErrorH1.setAttribute('id', 'error');
			// now add message
			flashErrorH1.textContent = 'Password must match!';
			// plug the h1 below the navbar
			// so, select the navbar first
			const navbar = document.getElementById('navbar');
			// now insert the h1 befor the next sibbling of the nav bar
			navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
		}
	}
});
