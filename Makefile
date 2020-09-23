.PHONY: venv
venv: 
	python3 -m venv venv; \
	source venv/bin/activate; \
	pip3 install -r requirements.txt;

.PHONY: extra_folders
extra_folders: create_folder
	touch server/.log_files/data_log_qc.csv server/.log_files/data_log_roles.csv server/.log_files/data_log_user.csv

create_folder:
	mkdir server/.log_files
