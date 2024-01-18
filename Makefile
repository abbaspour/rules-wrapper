all: test

test: node_modules
	pnpm run test

lint: node_modules
	pnpm run lint

node_modules: package.json
	pnpm i

clean:
	rm -rf node_modules

publish:
	npm publish

.PHONY: test install clean lint