include .env

compose-up:
	@docker compose --env-file .env \
		--file ./infrastructure/orchestration/docker/docker-compose.yml up \
		--detach \
		--build

compose-down:
	@docker compose --env-file .env \
		--file ./infrastructure/orchestration/docker/docker-compose.yml down

compose-down-clean:
	@docker compose --env-file .env \
		--file ./infrastructure/orchestration/docker/docker-compose.yml down \
		--volumes \
		--remove-orphans
