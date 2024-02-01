compose = docker compose
exec-container = $(compose) exec -T php

up:
	$(compose) kill
	$(compose) build
	$(compose) up -d

down:
	$(compose) kill

exec:
	$(exec-container) $(cmd)

ssh:
	$(exec-container) /bin/sh

entity:
	$(exec-container) bin/console make:entity $(name)

migration:
	$(exec-container) bin/console make:migration

migrate:
	$(exec-container) bin/console doctrine:migration:migrate

fixtures:
	$(exec-container) bin/console doctrine:fixtures:load
