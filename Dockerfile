FROM node:20-alpine

WORKDIR /app

# Install ALL deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy source
COPY tsconfig.json vite.config.ts index.html ./
COPY src/ src/
COPY public/ public/
COPY server/ server/

# Build frontend
RUN npm run build

EXPOSE 3000

ENV DATA_DIR=/app/data

CMD ["npx", "tsx", "server/index.ts"]
