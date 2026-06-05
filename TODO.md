# TODO

## Plan (được duyệt)
1. Chỉnh `index.js` để đọc Mongo URI từ biến môi trường (MONGODB_URI).
2. Thay logic connect Mongo:
   - không `process.exit(1)` ngay khi connect fail
   - thêm retry (vài lần, có delay)
3. Sửa lỗi listen port: chỉ gọi `app.listen` 1 lần.
4. Xác minh app không crash khi Mongo chưa sẵn sàng.
5. Chạy `npm run dev` để kiểm tra log.

