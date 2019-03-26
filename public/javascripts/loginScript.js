function show() {
	// Get Values
	var username = document.getElementById('username_1').value;
	var password = document.getElementById('password_1').value;
	
	// Alert
	alert("--- Your Input ---\nUsername: " + username + "\nPassword: " + password);
}

// function check(event) {
// 	// Get Values
// 	var username = document.getElementById('username_1').value;
// 	var password = document.getElementById('password_1').value;
	
// 	// Simple Check
// 	if (username.length == 0) {
// 		alert("Invalid username");
// 		event.preventDefault();
// 		event.stopPropagation();
// 		return false;
// 	}
// 	if (password.length == 0) {
// 		alert("Invalid password");
// 		event.preventDefault();
// 		event.stopPropagation();
// 		return false;
// 	}
// }