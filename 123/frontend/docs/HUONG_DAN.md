Frontend của **3D MLOps Copilot Platform** được xây dựng bằng React và TypeScript. Giao diện gồm danh sách thực nghiệm, không gian 3D và khung chat AI.

## Chạy dự án

Yêu cầu Node.js `>=22.12.0` và npm (khuyến nghị Node.js 24 LTS). Mở terminal tại thư mục `frontend`, sau đó chạy:

```bash
npm install
npm run dev
```
Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`. Có thể dùng `npm ci` thay cho `npm install` để cài đúng phiên bản trong lockfile.

Các lệnh thường dùng:

| Lệnh | Tác dụng |
| --- | --- |
| `npm run dev` | Chạy ứng dụng ở chế độ phát triển |
| `npm run build` | Kiểm tra TypeScript và tạo bản build trong `dist/` |
| `npm run lint` | Kiểm tra mã nguồn |
| `npm test` | Chạy kiểm thử |
| `npm run preview` | Xem thử bản build cục bộ |

Chạy các lệnh tại thư mục `frontend`. Cần chạy `npm run build` trước khi dùng `npm run preview`.

## Chức năng hiện có

- Trang thực nghiệm hiển thị tại `/experiments/:experimentId`; các trang khác gồm `/settings` và `/help`.
- Sidebar hỗ trợ tìm kiếm, lọc và tạo thực nghiệm. ID trên URL xác định thực nghiệm đang chọn.
- Cảnh 3D hỗ trợ xoay và thu phóng. Trên màn hình nhỏ, Sidebar và chat mở qua Drawer.
- Cài đặt cho phép đổi màu giao diện; lựa chọn được lưu trong trình duyệt.

**Lưu ý:** dữ liệu thực nghiệm được lưu trong `localStorage`; cảnh 3D và câu trả lời chat hiện là mô phỏng. Lịch sử chat chỉ tồn tại trong phiên hiện tại. Đây chưa phải dữ liệu huấn luyện hoặc AI thật.

## Cấu trúc và tích hợp

Xem [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) để biết cây thư mục và vai trò từng phần. Routing, giao diện, hook và lớp dữ liệu được tách riêng để thuận tiện phát triển.

Khi tích hợp backend, thay lớp dữ liệu tại `src/services/experiments.ts`. Với AI thật, frontend gửi yêu cầu tới backend; **không đặt khóa API trong mã frontend hoặc biến `VITE_*`**.

Khi triển khai ứng dụng dùng `BrowserRouter`, cấu hình hosting để các đường dẫn frontend trả về `index.html` (SPA fallback); nếu không, tải lại trang con có thể báo 404.