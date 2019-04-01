const sql = {}

sql.query = {
	// Login
	userpass: 'SELECT * FROM users WHERE username=$1',
	
	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
	update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',
	
	// Query all tasks
	query_request: 'SELECT * FROM job_request',
	query_offer: 'SELECT * FROM job_offer',

	// Query tasks on user id
	query_request_user: 'SELECT * FROM job_request WHERE job_request.user=$1',
	query_offer_user: 'SELECT * FROM job_offer WHERE job_offer.user=$1',

	// Query tasks on job id
	query_request_job: 'SELECT * FROM job_request WHERE job_request.job_id=$1',
	query_offer_job: 'SELECT * FROM job_offer WHERE job_offer.job_id=$1',
	query_bids_request: 'SELECT * from request_bids WHERE job_id=$1',
	query_bids_offer: 'SELECT * from offer_bids WHERE job_id=$1',


	// Query tasks on task name
	query_request_search: 'SELECT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.user=$2',
	query_offer_search: 'SELECT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.user=$2',

	// Insert bids
	insert_request_bids: 'INSERT INTO request_bids VALUES($1, $2, $3, $4)',
	update_request_bids: 'UPDATE request_bids as b SET bid_accepted=true where bid_id = $1 and exists (select 1 from job_request as j where j.job_id = b.job_id and j.user = $2)'
}

module.exports = sql