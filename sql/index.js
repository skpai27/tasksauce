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
	query_request_unbid: 'SELECT * FROM job_request WHERE NOT EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id)',
	query_offer_unbid: 'SELECT * FROM job_offer WHERE NOT EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id)',

	// Query tasks on user id
	query_request_user: 'SELECT * FROM job_request WHERE job_request.user=$1 AND NOT EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id)',
	query_offer_user: 'SELECT * FROM job_offer WHERE job_offer.user=$1 AND NOT EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id)',
	query_request_inprog: 'SELECT * FROM job_request WHERE job_request.user=$1 AND EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id)',
	query_offer_inprog: 'SELECT * FROM job_offer WHERE job_offer.user=$1 AND EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id)',

	// Query tasks on job id
	query_request_job: 'SELECT * FROM job_request WHERE job_request.job_id=$1',
	query_offer_job: 'SELECT * FROM job_offer WHERE job_offer.job_id=$1',
	query_bids_request: 'SELECT * FROM request_bids WHERE job_id=$1',
	query_bids_offer: 'SELECT * FROM offer_bids WHERE job_id=$1',


	// Query tasks on task name
	query_request_search: 'SELECT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.user=$2',
	query_offer_search: 'SELECT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.user=$2',

	// Query job_id from bid
	query_request_from_bidId: 'SELECT * FROM request_bids WHERE bid_id=$1',
	query_offer_from_bidId: 'SELECT * FROM offer_bids WHERE bid_id=$1',

	// Query bid from job_id
	query_bid_from_request_IP: 'SELECT * FROM request_in_progress WHERE job_id=$1',
	query_bid_from_offer_IP: 'SELECT * FROM offer_in_progress WHERE job_id=$1',

	// Insert bids
	insert_request_bids: 'INSERT INTO request_bids VALUES($1, $2, $3, $4)',
	insert_offer_bids: 'INSERT INTO offer_bids VALUES($1, $2, $3, $4)',

	// Accept bid -> Add to in-progress table
	update_request_bids: 'INSERT INTO request_in_progress VALUES($1, $2)',
	update_offer_bids: 'INSERT INTO offer_in_progress VALUES($1, $2)'

}

module.exports = sql