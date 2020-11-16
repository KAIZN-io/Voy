# SHELL := /bin/bash
# Important for the developement process
# ============================================================
.PHONY: venv
venv: 
	python3 -m venv venv; \
	source venv/bin/activate; \
	pip3 install -r requirements.txt;

.PHONY: deployment
deployment: 
	mkdir instance; \
	touch instance/config.py;

