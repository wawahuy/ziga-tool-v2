FROM node:12.18-alpine

ENV PORT=9900

WORKDIR /src/tool_ziga_v2
COPY . .
RUN npm i

EXPOSE 9900

CMD "npm" "run" "prod"
