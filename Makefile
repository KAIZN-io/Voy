# Important for the developement process
# ============================================================
.PHONY: venv
venv: 
	python3 -m venv venv; \
	source venv/bin/activate; \
	pip3 install -r requirements.txt;

.PHONY: deployment
deployment: create_folder
	mkdir instance; \
	touch instance/config.py;

# NOTE: Does not work yet 
create_folder: 
ifneq ($(wildcard /server/.log_files),)
	@echo "Found server/.log_files."
else
	@echo "Did not found server/.log_files."
	mkdir server/.log_files
endif
