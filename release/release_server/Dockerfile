FROM node:12.18-alpine

ENV PORT=9900

WORKDIR /src/tool_ziga_v2
COPY package*.json ./
RUN npm install --only=prod

COPY . .

EXPOSE 9900

CMD "npm" "run" "prod"
