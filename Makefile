ifneq (,$(wildcard ./.env))
	include .env
endif

NODE_BIN = $(shell npm bin)
TS_NODE = $(NODE_BIN)/ts-node
JEST_NODE = $(NODE_BIN)/jest

.PHONY: run

run:
	@echo "Running..."
	@$(TS_NODE) src/index.ts $(CRYPTO_EXPORTS)

test:
	@echo "Testing..."
	@$(JEST_NODE)
