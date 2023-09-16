FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "src/server.js"]
EXPOSE 3000