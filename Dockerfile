FROM node:12.18-alpine

ENV PORT=9900

WORKDIR /src/tool_ziga_v2
COPY . .

# build script
RUN cd ./script
RUN npm i

# build server
RUN cd ../server
RUN npm i
RUN ./build-prod.sh

EXPOSE 9900

CMD "npm" "run" "prod"
