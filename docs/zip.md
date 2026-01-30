# Cấu trúc ZIP chi tiết cho Quizly

## 1. Tổng quan

Hệ thống sử dụng **file ZIP** chứa:

```
quiz_package.zip
├── config.yaml          # Metadata và cấu hình đề thi
├── questions.yaml       # Danh sách câu hỏi
└── media/              # Thư mục chứa hình ảnh, audio, video
    ├── question_1.png
    ├── answer_a_2.jpg
    ├── audio_intro.mp3
    └── ...
```

---

## 2. File `config.yaml`

Chứa thông tin metadata và cấu hình đề thi:

```yaml
metadata:
  title: "Tên đề thi"
  subject: "Môn học"
  grade: "Khối lớp"
  author: "Tên tác giả"

exam:
  description: "Mô tả bài thi"
  duration_minutes: 45
  start_time: "2025-01-01T00:00:00"
  end_time: "2025-12-31T23:59:59"
  shuffle_questions: true
  shuffle_answers: true
```

**Mô tả các trường:**

### metadata:
- `title`: Tiêu đề bài ôn tập
- `subject`: Môn học (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, v.v.)
- `grade`: Khối học (ví dụ: "10", "11", "12H")
- `author`: Người tạo đề thi

### exam:
- `description`: Mô tả chi tiết về bài thi
- `duration_minutes`: Thời gian làm bài (phút). Đặt `0` nếu không giới hạn
- `start_time`: Thời gian bắt đầu cho phép làm bài (ISO 8601)
- `end_time`: Thời gian kết thúc cho phép làm bài (ISO 8601)
- `shuffle_questions`: `true/false` - Xáo trộn câu hỏi trong mỗi nhóm
- `shuffle_answers`: `true/false` - Xáo trộn đáp án (MC) và items (TF)

---

## 3. File `questions.yaml`

Cả trắc nghiệm ABCD và trắc nghiệm Đúng/Sai đều được bao bọc bở duy nhất 1 một `questions:`
Chứa danh sách câu hỏi với 2 loại:

### 3.1. Câu hỏi trắc nghiệm ABCD (`multiple_choice`)

```yaml
questions:
  - type: multiple_choice
    question:
      text: "Nội dung câu hỏi (hỗ trợ Markdown)"
      media: "question_1.png"                    # 1 file
    choices:
      A:
        text: "Đáp án A"
        media: "answer_a_1.jpg"                  # Tùy chọn
      B:
        text: "Đáp án B"
        media: ["graph_b.png", "sound_b.mp3"]    # Nhiều file
      C:
        text: "Đáp án C"
      D:
        text: "Đáp án D"
    correct: "A"
```

**Lưu ý:**
- `media`: Có thể là **chuỗi** (1 file) hoặc **mảng** (nhiều file)
- Hệ thống tự động nhận diện loại file qua đuôi mở rộng
- `choices` phải có các key (A, B, C, D, hoặc tùy chỉnh)
- `correct` phải khớp với một key trong `choices`
- Text hỗ trợ Markdown đầy đủ

---

### 3.2. Câu hỏi Đúng/Sai (`true_false_group`)

```yaml
  - type: true_false_group # Không có questions: vì trong một questions.yaml chỉ có duy nhất một questions: đã có ở trên, nếu chỉ có trắc nghiệm đúng sai thì mới để questions: ở đoạn này
    question:
      text: "Đề bài chung cho nhóm câu Đúng/Sai"
      media: ["diagram.png", "intro.mp3"]        # Nhiều file
    items:
      a:
        text: "Mệnh đề 1"
        media: "item_a.png"                      # 1 file
        correct: true
      b:
        text: "Mệnh đề 2"
        media: ["graph_b.jpg", "audio_b.mp3"]    # Nhiều file
        correct: false
      c:
        text: "Mệnh đề 3"
        correct: true
      d:
        text: "Mệnh đề 4"
        media: "video_d.mp4"
        correct: false
```

**Lưu ý:**
- Mỗi item có `correct: true` hoặc `correct: false`
- Học sinh phải trả lời ĐÚNG **tất cả** các items mới được tính là đúng câu hỏi
- Media có thể là 1 file hoặc nhiều file (mảng)

---

## 4. Thư mục `media/`

Chứa tất cả các file media được tham chiếu trong `questions.yaml`:

```
media/
├── question_1.png
├── diagram.png
├── audio.mp3
├── video_demo.mp4
└── ...
```

**Định dạng được hỗ trợ (tự động nhận diện):**

| Loại | Đuôi file |
|------|-----------|
| **Hình ảnh** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.bmp` |
| **Audio** | `.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`, `.flac` |
| **Video** | `.mp4`, `.webm`, `.ogg`, `.mov`, `.avi` |

---

## 5. Ví dụ hoàn chỉnh

(Như trên)
---

## 6. Quy trình hoạt động

### 6.1. Khi tải bài thi:
1. Người dùng tải file ZIP lên hệ thống
2. Hệ thống giải nén và đọc `config.yaml`
3. Kiểm tra thời gian (`start_time`, `end_time`)
4. Hiển thị thông tin đề thi
5. Nhấn "Bắt đầu làm bài"

### 6.2. Trong khi làm bài:
1. Đọc `questions.yaml` và load media từ thư mục `media/`
2. Tự động nhận diện loại file qua đuôi mở rộng
3. Hiển thị câu hỏi theo nhóm: **Trắc nghiệm** → **Đúng/Sai**
4. Xáo trộn câu hỏi/đáp án nếu được cấu hình
5. Hiển thị media:
   - **Hình ảnh**: Hiển thị inline hoặc gallery
   - **Audio**: Audio player với controls
   - **Video**: Video player với controls
6. Đếm thời gian
7. Sidebar hiển thị tiến độ

### 6.3. Khi nộp bài:
1. Chấm điểm ngay lập tức
2. Hiển thị kết quả chi tiết
3. Tính điểm tổng kết

---

## 7. Cú pháp Media

```yaml
# 1 file - dùng chuỗi
media: "filename.png"

# Nhiều file - dùng mảng
media: ["file1.png", "file2.mp3", "file3.mp4"]

# Hoặc dùng YAML list syntax
media:
  - "file1.png"
  - "file2.mp3"
```

---

## 8. Lưu ý quan trọng

### Cấu trúc ZIP:
- Bắt buộc có `config.yaml` và `questions.yaml` ở thư mục gốc
- Thư mục `media/` phải ở cùng cấp với 2 file YAML
- Không nén thư mục cha

### Media:
- Tên file không chứa ký tự đặc biệt
- Tên file phân biệt hoa thường (case-sensitive)

---

## 9. Checklist

- [ ] `config.yaml` có đầy đủ metadata và exam
- [ ] `questions.yaml` có cấu trúc hợp lệ
- [ ] Thư mục `media/` chứa tất cả file được tham chiếu
- [ ] Tên file media khớp chính xác
- [ ] Media dùng chuỗi (1 file) hoặc mảng (nhiều file)
- [ ] Mỗi câu MC có `correct` hợp lệ
- [ ] Mỗi item TF có `correct: true/false`
- [ ] Cấu trúc ZIP đúng (không nén thư mục cha)

