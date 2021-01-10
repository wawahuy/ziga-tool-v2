docker-compose stop
docker-compose rm -f

docker rmi ziga/ziga_tool_v2:lasted || true
docker tag ziga/ziga_tool_v2:build ziga/ziga_tool_v2:lasted

docker-compose up -d
