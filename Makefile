deploy:
	@git push dokku

run:
	@meteor

.PHONY: deploy run
