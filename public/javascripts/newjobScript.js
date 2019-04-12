function check(event) {
	// Get Values
    var job = document.getElementById('job').value;
    var loc = document.getElementById('loc').value;
    var details = document.getElementById('details').value;
	
	// Simple Check
	if(job.length > 64) {
		alert("Invalid Job Title, up to 64 characters are allowed.");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(loc.length > 128) {
		alert("Invalid Location, up to 128 characters are allowed.");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(details.length > 128) {
		alert("Invalid Job Details, up to 128 characters are allowed.");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}