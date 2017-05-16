deploy:
	@git push heroku

run:
	@meteor

.PHONY: deploy run
