# Hướng dẫn cài đặt và sử dụng VocabAI

## Bước 1: Cài đặt API Key

1. **Lấy Google Gemini API Key:**
   - Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Đăng nhập với Google account
   - Tạo API key mới
   - Copy API key

2. **Cấu hình môi trường:**
   ```bash
   cp .env.example .env
   ```
   - Mở file `.env` và thay thế `your_gemini_api_key_here` bằng API key thực của bạn

## Bước 2: Chạy ứng dụng

### Chạy development mode:
```bash
npm install
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

### Chạy với Docker:
```bash
docker compose up --build
```
Ứng dụng sẽ chạy tại: http://localhost:3000

## Cách sử dụng

### Học từ vựng:
1. Chọn "Học từ vựng" từ trang chủ
2. Nhập chủ đề (ví dụ: "gia đình", "công việc", "thực phẩm")
3. Chọn số lượng câu hỏi (3-20 câu)
4. Làm bài tập và xem kết quả

### Học nói (đang phát triển):
1. Chọn "Học nói" từ trang chủ
2. Nhập chủ đề và chọn trình độ
3. Tính năng này sẽ được cập nhật trong phiên bản tới

## Lưu ý bảo mật

- **KHÔNG** commit file `.env` lên Git
- Giữ API key bí mật và không chia sẻ
- Sử dụng environment variables trong production

## Troubleshooting

### Lỗi "API key not found":
- Kiểm tra file `.env` có tồn tại không
- Đảm bảo tên biến là `VITE_GEMINI_API_KEY`
- Restart development server sau khi thay đổi `.env`

### Lỗi kết nối API:
- Kiểm tra API key có đúng không
- Đảm bảo có kết nối internet
- Kiểm tra quota của Google Gemini API 