.PHONY: all deploy-postgres deploy-redis deploy-dapr-components build-subscribers load-subscribers deploy-subscribers logs-alpha logs-beta clean-subscribers clean-dapr-components clean-redis clean-postgres clean-all

# Variables
K8S_NAMESPACE ?= default
CLUSTER_NAME ?= dapr-demo
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max

all: deploy-postgres deploy-redis deploy-dapr-components build-subscribers load-subscribers deploy-subscribers

# PostgreSQL
deploy-postgres:
	kubectl apply -f common/postgres.yaml -n $(K8S_NAMESPACE)

# Redis
deploy-redis:
	kubectl apply -f common/redis.yaml -n $(K8S_NAMESPACE)

# Dapr Components
deploy-dapr-components:
	kubectl apply -f common/pubsub-apps.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f common/pubsub-drasi.yaml -n drasi-system

# Subscriber Applications
build-subscribers:
	docker buildx build $(DOCKERX_OPTS) -t post-dapr-pubsub-validation-subscriber-alpha:latest ./subscriber_alpha
	docker buildx build $(DOCKERX_OPTS) -t post-dapr-pubsub-validation-subscriber-beta:latest ./subscriber_beta

load-subscribers:
	@echo "Loading images into Kind cluster '$(CLUSTER_NAME)'..."
	k3d image import post-dapr-pubsub-validation-subscriber-alpha:latest -c $(CLUSTER_NAME) || echo "Failed to load subscriber-alpha, ensure k3d cluster '$(CLUSTER_NAME)' exists or image is already loaded."
	k3d image import post-dapr-pubsub-validation-subscriber-beta:latest -c $(CLUSTER_NAME) || echo "Failed to load subscriber-beta, ensure k3d cluster '$(CLUSTER_NAME)' exists or image is already loaded."

deploy-subscribers:
	kubectl apply -f subscriber_alpha/deployment.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f subscriber_beta/deployment.yaml -n $(K8S_NAMESPACE)

# View logs
logs-alpha:
	kubectl logs -f -l app=subscriber-alpha -c subscriber-alpha -n $(K8S_NAMESPACE)

logs-beta:
	kubectl logs -f -l app=subscriber-beta -c subscriber-beta -n $(K8S_NAMESPACE)

# Cleanup
clean-subscribers:
	kubectl delete -f subscriber_alpha/deployment.yaml -n $(K8S_NAMESPACE) --ignore-not-found=true
	kubectl delete -f subscriber_beta/deployment.yaml -n $(K8S_NAMESPACE) --ignore-not-found=true

clean-dapr-components:
	kubectl delete -f common/pubsub-apps.yaml -n $(K8S_NAMESPACE) --ignore-not-found=true
	kubectl delete -f common/pubsub-drasi.yaml -n drasi-system --ignore-not-found=true

clean-redis:
	kubectl delete -f common/redis.yaml -n $(K8S_NAMESPACE) --ignore-not-found=true

clean-postgres:
	kubectl delete -f common/postgres.yaml -n $(K8S_NAMESPACE) --ignore-not-found=true

clean-all: clean-subscribers clean-dapr-components clean-redis clean-postgres