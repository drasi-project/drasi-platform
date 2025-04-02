.PHONY: default docker-build kind-load test

default: docker-build

docker-build:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

docker-build-debug:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

test:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)