CREATE TABLE public.users (
	"username" CHAR(64),
	"email" CHAR(128),
	"password" CHAR(60),
	CONSTRAINT users_pkey PRIMARY KEY (username)
);

CREATE TABLE job_request (
	"job" CHAR(64) PRIMARY KEY,
	"loc" CHAR(128),
	"date" DATE,
	"var" TIME,
	"desc" CHAR(128)
);

INSERT INTO public.users (username, email, password)
VALUES ('dummy1','dummy1@yahoo.com','$2b$10$99cAtaDvYXFAJCMOqGavCuML5dCdlDYZoAEYfwVXu/ASZpKiAGPnS');

INSERT INTO public.users (username, email, password)
VALUES ('dummy2','dummy2@yahoo.com','$2b$10$99cAtaDvYXFAJCMOqGavCuDrC4GADX0PaHFJ8M08gTnAsBiE2LCwW');

INSERT INTO job_request ("job", "loc", "date", "var", "desc") 
VALUES ('Babysitting', 'AMK', '2019-08-13', '05:30', 'Look after 4yo');