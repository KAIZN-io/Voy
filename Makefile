# Important for the developement process
# ============================================================
# SHELL := /bin/bash
.PHONY: venv
venv: 
	python3 -m venv venv; \
	source venv/bin/activate; \
	pip3 install -r requirements.txt;

