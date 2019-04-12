function check(event) {
	// Get Values
    var details = document.getElementById('details').value;
	
	// Simple Check
	if(details.length > 128) {
		alert("Invalid Bid Details, up to 128 characters are allowed.");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}