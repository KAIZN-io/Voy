CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE qc_check (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checker TEXT,
    study_id int,
    scr_no int,
    type TEXT,
    visit TEXT,
    page TEXT,
    procedure TEXT,
    description TEXT,
    responsible TEXT,
    corrected BIT,
    close BIT
);
CREATE TABLE db_user (
	id INTEGER PRIMARY KEY AUTOINCREMENT, 
	email VARCHAR(100), 
	password VARCHAR(100),
	abbrev TEXT, 
	role TEXT,
	UNIQUE (email),
	UNIQUE (abbrev)
);
CREATE TABLE user_management (
	id INTEGER PRIMARY KEY AUTOINCREMENT, 
	email VARCHAR(100), 
	abbrev TEXT, 
	date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	action TEXT,
	role TEXT,
	change_by TEXT,
	UNIQUE (email),
	UNIQUE (abbrev)
);