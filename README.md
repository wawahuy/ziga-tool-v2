# Ziga Tool V2
  Tập hợp các công cụ chơi game cờ tướng mạng mẽ

## Các sản phẩm bao gồm
  - project <b>script</b>: xây dựng code inject vào ziga
  - project <b>app</b>: xữ lí logic với stockfish & proxy với project server
  - project <b>extensions</b>: tự động gọi và import code inject
  - project <b>server</b>: quản lý toàn bộ user sử dụng tools và phân bổ token

## Project Script:
  - chứa các đoạn mã sẽ tiêm vào game
  - cách chèn:
    + dev: được chèn thông qua build serve ở port 3000
    + prod: được chèn thông qua app ở port 14342, tại đây app sẽ đảm nhận nhiệm vụ proxy đến server
  - các file được build hoàn thành sẽ được copy vào project server.

## Project App:
  - thực hiện các hàm logic và response về script
  - đảm nhận check token & proxy đến các file inject của server
  - port:
    + dev/prod: 14342

## Project Server
  - thực hiện việc check token vào lưu giữ các inject file
  - port:
    + dev/prod: 4000

## Build
  - build app vào ./app/build-xxx.sh để xây dựng
  - build server xem cấu hình jenkins và docker

### Release Server
- Bao gồm các min file của 2 dự án script & server

### Release App
- Chứa file bin có khả năng run trên windows được build từ dự án app