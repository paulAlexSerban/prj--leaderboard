include .env

INFRA_ORCHESTRATION := ./infrastructure/orchestration/docker

compose-up:
	@docker compose --env-file .env \
		--file $(INFRA_ORCHESTRATION)/$(PROJECT_NAME).docker-compose.yml up \
		--detach \
		--build

compose-down:
	@docker compose --env-file .env \
		--file $(INFRA_ORCHESTRATION)/$(PROJECT_NAME).docker-compose.yml down

compose-down-clean:
	@docker compose --env-file .env \
		--file $(INFRA_ORCHESTRATION)/$(PROJECT_NAME).docker-compose.yml down \
		--volumes \
		--remove-orphans
