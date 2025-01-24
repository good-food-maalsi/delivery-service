FROM oven/bun:canary
WORKDIR /app
COPY package.json /app
RUN bun install
COPY . /app
CMD ["bun","run","dev"]
