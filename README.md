# Quizly - Nền tảng ôn tập trực tuyến

Quizly là công cụ tạo và làm bài ôn tập trực tuyến miễn phí, mã nguồn mở. Hệ thống gồm **Editor** để soạn đề và **Player** để làm bài, hỗ trợ hình ảnh, âm thanh, video và tích hợp Supabase để lưu trữ đám mây.

## Tính năng chính

### Editor (Soạn đề)
- Tạo câu hỏi trắc nghiệm ABCD, Đúng/Sai
- Upload hình ảnh, audio, video
- Tùy chỉnh thời gian, xáo trộn câu hỏi
- Xuất file ZIP hoặc đăng lên cloud

### Player (Làm bài)
- Giao diện responsive trên điện thoại/desktop
- Bộ đếm giờ, cảnh báo hết thời gian
- Chấm điểm tự động, hiển thị kết quả chi tiết
- Hỗ trợ playback media trực tiếp

### Cloud Storage
- Tích hợp Supabase Edge Functions
- Tự động xóa sau 7 ngày
- Chia sẻ bằng link đơn giản

## Hình ảnh demo

### Giao diện chính
![Trang chủ Quizly](screenshot1.png)

### Editor tạo câu hỏi
![Giao diện Editor](screenshot2.png)

### Làm bài ôn tập
![Giao diện Player](screenshot3.png)

## Sử dụng ngay

**Demo trực tuyến:**
- Editor: https://maple-zip.github.io/quizly/app/
- Player mẫu: https://maple-zip.github.io/quizly?r=https://raw.githubusercontent.com/maple-zip/quizly/refs/heads/main/test.zip

**Chạy local:**
Clone repo và mở file HTML trong trình duyệt:
```bash
git clone https://github.com/maple-zip/quizly.git
# Mở app/index.html (Editor) hoặc quizly.html (Player)
```

## Lưu ý

- Mỗi đề trên cloud chỉ lưu **7 ngày**
- Chỉ dùng cho ôn tập, không dùng kiểm tra chính thức
- Miễn phí, mã nguồn mở, tự chịu trách nhiệm khi sử dụng

## Đóng góp

Chào đón mọi đóng góp qua GitHub Issues và Pull Requests.

**Giấy phép:** GNU GPL v3.0  
**Tác giả:** maple-zip © 2026

---

⭐ Nếu thấy hữu ích, hãy star repo trên GitHub!
