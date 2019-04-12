const sql = {}

util = {
	query_request_bidsxjobs: "SELECT DISTINCT jr.job_id AS job_id, rb.bid_id AS bid_id, jr.job AS job, jr.loc AS loc, jr.date AS date, jr.time AS time, rb.bid_price AS bid_price, rb.bid_info AS bid_info, rb.bid_user AS bid_user, 'request' AS bid_type FROM request_bids rb INNER JOIN job_request jr ON rb.job_id = jr.job_id",
	query_offer_bidsxjobs: "SELECT DISTINCT jo.job_id AS job_id, ob.bid_id AS bid_id, jo.job AS job, jo.loc AS loc, jo.date AS date, jo.time AS time, ob.bid_price AS bid_price, ob.bid_info AS bid_info, ob.bid_user AS bid_user, 'offer' AS bid_type FROM offer_bids ob INNER JOIN job_offer jo ON ob.job_id = jo.job_id",
	query_premium_request: 'SELECT DISTINCT "job", "loc", "date", "time", "details","username", "job_id", 1 as filter FROM job_request WHERE NOT EXISTS (SELECT 1 FROM request_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_request.job_id) and not exists (select * from request_completed where request_completed.job_id = job_request.job_id) AND username IN (SELECT username FROM premium_users)',
	query_normal_request: 'SELECT DISTINCT "job", "loc", "date", "time", "details","username", "job_id", 2 as filter FROM job_request WHERE NOT EXISTS (SELECT 1 FROM request_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_request.job_id) and not exists (select * from request_completed where request_completed.job_id = job_request.job_id) AND username NOT IN (SELECT username FROM premium_users)',
	query_premium_offer: 'SELECT DISTINCT "job", "loc", "date", "time", "details","username", "job_id", 1 as filter FROM job_offer WHERE NOT EXISTS (SELECT 1 FROM offer_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_offer.job_id) and not exists (select * from offer_completed where offer_completed.job_id = job_offer.job_id) AND username IN (SELECT username FROM premium_users)',
	query_normal_offer: 'SELECT DISTINCT "job", "loc", "date", "time", "details","username", "job_id", 2 as filter FROM job_offer WHERE NOT EXISTS (SELECT 1 FROM offer_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_offer.job_id) and not exists (select * from offer_completed where offer_completed.job_id = job_offer.job_id) AND username NOT IN (SELECT username FROM premium_users)',
	query_all_requestC: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM request_completed NATURAL JOIN job_request NATURAL JOIN request_bids',
	query_all_offerC: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM offer_completed NATURAL JOIN job_offer NATURAL JOIN offer_bids',
	query_all_requestIP: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM request_in_progress NATURAL JOIN job_request NATURAL JOIN request_bids',
	query_all_offerIP: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM offer_in_progress NATURAL JOIN job_offer NATURAL JOIN offer_bids',
}

sql.query = {
	// Login
	userpass: 'SELECT DISTINCT * FROM users WHERE username=$1',
	
	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
	update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',

	// Check if user is an admin
	is_admin: 'SELECT is_admin FROM users WHERE username=$1',

	// Load from job_request
	all_requests: 'SELECT DISTINCT * FROM job_request ORDER BY date, time',
	all_available_requests: 'WITH premium AS (' + util.query_premium_request + ' UNION ' + util.query_normal_request +') SELECT DISTINCT * FROM premium ORDER BY filter, date, time',
	requests_filter: 'select DISTINCT * from job_request where (job_request.details ilike  \'%\'  || $1 || \'%\' or  job_request.job ilike  \'%\'  || $1 || \'%\' or job_request.username ilike  \'%\'  || $1 || \'%\') and  NOT EXISTS (SELECT 1 FROM request_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_request.job_id) and not exists (select * from request_completed where request_completed.job_id = job_request.job_id) ORDER BY date, time;', 
	offers_filter:'SELECT DISTINCT * FROM job_offer WHERE (job_offer.details ilike  \'%\'  || $1 || \'%\' or  job_offer.job ilike  \'%\'  || $1 || \'%\' or job_offer.username ilike  \'%\'  || $1 || \'%\') AND NOT EXISTS (SELECT 1 FROM offer_in_progress AS off_unavailable WHERE off_unavailable.job_id=job_offer.job_id) and not exists (select * from offer_completed where offer_completed.job_id = job_offer.job_id) ORDER BY date, time;', 
	
	// Load from job_offer
	all_offers: 'SELECT DISTINCT * FROM job_offer ORDER BY date, time',
	all_available_offers: 'WITH premium AS (' + util.query_premium_offer + ' UNION ' + util.query_normal_offer +') SELECT DISTINCT * FROM premium ORDER BY filter, date, time',

	//Update reviews
	update_review_bidder_request: 'UPDATE request_completed SET bidder_review= $1,bidder_rating = $2 where job_id= $3;',
	update_review_author_request: 'UPDATE request_completed SET author_review= $1,author_rating = $2 where job_id= $3;',
	update_review_bidder_offer: 'UPDATE offer_completed SET bidder_review= $1,bidder_rating = $2 where job_id= $3;',
	update_review_author_offer: 'UPDATE offer_completed SET author_review= $1,author_rating = $2 where job_id= $3;',
	
	// Query all tasks
	query_request: 'SELECT DISTINCT * FROM job_request',
	query_offer: 'SELECT DISTINCT * FROM job_offer',
	query_request_unbid: 'WITH premium AS (' + util.query_premium_request + ' UNION ' + util.query_normal_request +') SELECT DISTINCT "job", "loc", "date", "time", "details","username" FROM premium ORDER BY filter, date, time',
	query_offer_unbid: 'WITH premium AS (' + util.query_premium_offer + ' UNION ' + util.query_normal_offer +') SELECT DISTINCT "job", "loc", "date", "time", "details","username" FROM premium ORDER BY filter, date, time',
	query_all_requestC: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM request_completed NATURAL JOIN job_request NATURAL JOIN request_bids',
	query_all_offerC: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM offer_completed NATURAL JOIN job_offer NATURAL JOIN offer_bids',
	query_all_requestIP: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM request_in_progress NATURAL JOIN job_request NATURAL JOIN request_bids',
	query_all_offerIP: 'SELECT DISTINCT job_id, bid_id, username AS userjob, bid_user AS userbid, job, loc, date, time, details FROM offer_in_progress NATURAL JOIN job_offer NATURAL JOIN offer_bids',

	// Query tasks on user id
	query_request_user: 'SELECT DISTINCT * FROM job_request WHERE job_request.username=$1 AND NOT EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id) AND NOT EXISTS (SELECT 1 FROM request_completed WHERE job_id=job_request.job_id)',
	query_offer_user: 'SELECT DISTINCT * FROM job_offer WHERE job_offer.username=$1 AND NOT EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id) AND NOT EXISTS (SELECT 1 FROM offer_completed WHERE job_id=job_offer.job_id)',
	query_request_inprog: 'SELECT DISTINCT * FROM job_request WHERE job_request.username=$1 AND EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id)',
	query_offer_inprog: 'SELECT DISTINCT * FROM job_offer WHERE job_offer.username=$1 AND EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id)',

	// Query tasks on job id
	query_request_job: 'SELECT DISTINCT * FROM job_request WHERE job_request.job_id=$1',
	query_offer_job: 'SELECT DISTINCT * FROM job_offer WHERE job_offer.job_id=$1',
	query_bids_request: 'SELECT DISTINCT * FROM request_bids WHERE job_id=$1 ORDER BY bid_price ASC',
	query_bids_offer: 'SELECT DISTINCT * FROM offer_bids WHERE job_id=$1 ORDER BY bid_price DESC',

	// Query tasks on task name
	query_request_search: 'SELECT DISTINCT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.username=$2 AND NOT EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id) AND NOT EXISTS (SELECT 1 FROM request_completed WHERE job_id=job_request.job_id)',
	query_offer_search: 'SELECT DISTINCT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.username=$2 AND NOT EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id) AND NOT EXISTS (SELECT 1 FROM offer_completed WHERE job_id=job_offer.job_id)',
	query_requestIP_search: 'SELECT DISTINCT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.username=$2 AND EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id)',
	query_offerIP_search: 'SELECT DISTINCT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.username=$2 AND EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id)',
	query_requestC_search: 'SELECT DISTINCT * FROM job_request WHERE LOWER(job_request.job) LIKE LOWER($1) and job_request.username=$2 AND EXISTS (SELECT 1 FROM request_completed WHERE job_id=job_request.job_id)',
	query_offerC_search: 'SELECT DISTINCT * FROM job_offer WHERE LOWER(job_offer.job) LIKE LOWER($1) and job_offer.username=$2 AND EXISTS (SELECT 1 FROM offer_completed WHERE job_id=job_offer.job_id)',
	query_all_requestC_search: 'SELECT DISTINCT * FROM (' + util.query_all_requestC + ') AS requestC WHERE LOWER(job) LIKE LOWER($1)',
	query_all_offerC_search: 'SELECT DISTINCT * FROM (' + util.query_all_offerC + ') AS offerC WHERE LOWER(job) LIKE LOWER($1)',
	query_all_requestIP_search: 'SELECT DISTINCT * FROM (' + util.query_all_requestIP + ') AS requestIP WHERE LOWER(job) LIKE LOWER($1)',
	query_all_offerIP_search: 'SELECT DISTINCT * FROM (' + util.query_all_offerIP + ') AS offerIP WHERE LOWER(job) LIKE LOWER($1)',
	query_combined_bids_search: 'SELECT DISTINCT * FROM (WITH rb_marked AS (' + util.query_request_bidsxjobs + '), ob_marked AS (' + util.query_offer_bidsxjobs + '), combined_bids AS (SELECT * FROM rb_marked UNION SELECT * FROM ob_marked) SELECT * FROM combined_bids WHERE bid_user=$1) AS bidUser WHERE LOWER(job) LIKE LOWER($2) OR LOWER(bid_info) LIKE LOWER($2)',

	// Query job_id from bid
	query_request_from_bidId: 'SELECT DISTINCT * FROM request_bids WHERE bid_id=$1',
	query_offer_from_bidId: 'SELECT DISTINCT * FROM offer_bids WHERE bid_id=$1',

	// Query bid from job_id
	query_bid_from_request_IP: 'SELECT DISTINCT * FROM request_in_progress WHERE job_id=$1',
	query_bid_from_offer_IP: 'SELECT DISTINCT * FROM offer_in_progress WHERE job_id=$1',
	query_bid_from_request_C: 'SELECT DISTINCT * FROM request_completed WHERE job_id=$1',
	query_bid_from_offer_C: 'SELECT DISTINCT * FROM offer_completed WHERE job_id=$1',

	// Insert bids
	insert_request_bids: 'INSERT INTO request_bids VALUES($1, $2, $3, $4)',
	insert_offer_bids: 'INSERT INTO offer_bids VALUES($1, $2, $3, $4)',

	// Accept bid -> Add to in-progress table
	update_request_bids: 'INSERT INTO request_in_progress VALUES($1, $2)',
	update_offer_bids: 'INSERT INTO offer_in_progress VALUES($1, $2)',

	// Delete (TODO: change to trigger)
	delete_request_IP: 'DELETE FROM request_in_progress WHERE job_id=$1',
	delete_offer_IP: 'DELETE FROM offer_in_progress WHERE job_id=$1',

	// Delete task (Only by Admin or Self)
	delete_request: 'DELETE FROM job_request WHERE job_request.job_id=$1',
	delete_offer: 'DELETE FROM job_offer WHERE job_offer.job_id=$1',

	// Edit task (Only by Admin or Self)
	edit_request: 'UPDATE job_request SET job=$2, loc=$3, date=$4, time=$5, details=$6 WHERE job_id=$1',
	edit_offer: 'UPDATE job_offer SET job=$2, loc=$3, date=$4, time=$5, details=$6 WHERE job_id=$1',

	// Delete bid (Only by Admin or Self)
	delete_request_bid: 'DELETE FROM request_bids WHERE bid_id=$1',
	delete_offer_bid: 'DELETE FROM offer_bids WHERE bid_id=$1',

	// Edit bid (Only by Admin or Self)
	edit_request_bid: 'UPDATE request_bids SET bid_price=$3, bid_info=$4 WHERE job_id=$1 and bid_id=$2',
	edit_offer_bid: 'UPDATE offer_bids SET bid_price=$3, bid_info=$4 WHERE job_id=$1 and bid_id=$2',

	// Insert completed
	insert_completed_request: 'INSERT INTO request_completed VALUES($1, $2)',
	insert_completed_offer: 'INSERT INTO offer_completed VALUES($1, $2)',

	// Query completed 
	query_request_completed: 'SELECT DISTINCT * FROM job_request WHERE job_request.username=$1 AND EXISTS (SELECT 1 FROM request_completed WHERE job_id=job_request.job_id)',
	query_offer_completed: 'SELECT DISTINCT * FROM job_offer WHERE job_offer.username=$1 AND EXISTS (SELECT 1 FROM offer_completed WHERE job_id=job_offer.job_id)',

	// Leaderboard queries
	query_request_top_offerers: 'SELECT DISTINCT username, count(*) FROM job_offer GROUP BY username ORDER BY count DESC LIMIT 5',
	query_request_top_completers: 'SELECT DISTINCT rb.bid_user as username, count(*) FROM request_completed rc INNER JOIN request_bids rb on rc.bid_id = rb.bid_id GROUP BY rb.bid_user ORDER BY count DESC',
	query_offer_top_completers: 'SELECT DISTINCT jo.username as username, count(*) FROM offer_completed oc INNER JOIN job_offer jo on oc.job_id = jo.job_id GROUP BY jo.username ORDER BY count DESC',

	// Premium users queries
	insert_premium_users: 'INSERT INTO premium_users VALUES($1)',
	is_premium_users: 'SELECT 1 FROM public.users WHERE username IN (SELECT username FROM premium_users) AND username=$1',

	// Bids of user queries
	query_bids_of_user: "WITH rb_marked AS (" + util.query_request_bidsxjobs + "), ob_marked AS (" + util.query_offer_bidsxjobs + "), combined_bids AS (SELECT * FROM rb_marked UNION SELECT * FROM ob_marked) SELECT * FROM combined_bids WHERE bid_user=$1",

	//Get Query comments
	query_user_comments: "SELECT DISTINCT * from user_comments where for_username = $1;",
	add_user_comments: "Insert into user_comments values ($1,$2,$3);",

	//
	query_job_request: "SELECT DISTINCT * FROM job_request WHERE job_request.job_id=$1 AND NOT EXISTS (SELECT 1 FROM request_in_progress WHERE job_id=job_request.job_id) AND NOT EXISTS (SELECT 1 FROM request_completed WHERE job_id=job_request.job_id)",
	query_job_offers: "SELECT DISTINCT * FROM job_offer WHERE job_offer.job_id=$1 AND NOT EXISTS (SELECT 1 FROM offer_in_progress WHERE job_id=job_offer.job_id) AND NOT EXISTS (SELECT 1 FROM offer_completed WHERE job_id=job_offer.job_id)"

}


module.exports = sql