deploy:
	@git push dokku

run:
	@meteor --port=3002

.PHONY: deploy run
