const sql = {}

sql.query = {
	// Login
	userpass: 'SELECT * FROM users WHERE username=$1',
	
	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
	update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',

	// // Load from job_request
	// all_requests: 'SELECT * FROM job_request ORDER BY date, time',

	// // Load from job_offer
	// all_offers: 'SELECT * FROM job_offer ORDER BY date, time',

	// Query all tasks
	query_request: 'SELECT * FROM job_request',
	query_offer: 'SELECT * FROM job_offer',

	// Query tasks on user id
	query_request_user: 'SELECT * FROM job_request WHERE job_request.user=$1',
	query_offer_user: 'SELECT * FROM job_offer WHERE job_offer.user=$1',

	// Query tasks on task name
	query_request_search: 'SELECT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.user=$2',
	query_offer_search: 'SELECT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.user=$2'
}

module.exports = sql