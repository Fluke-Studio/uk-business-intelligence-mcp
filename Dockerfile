FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist/ ./dist/
COPY README.md LICENSE ./
ENTRYPOINT ["node", "dist/mcp/index.js"]
