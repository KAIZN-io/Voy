create_files: create_folder
	touch server/.log_files/data_log_qc.csv server/.log_files/data_log_roles.csv server/.log_files/data_log_user.csv

create_folder:
	mkdir server/.log_files