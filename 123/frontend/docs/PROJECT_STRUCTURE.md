# Cấu trúc dự án Frontend

```text
frontend/
├── config/                         # Cấu hình công cụ
│   ├── oxlint.json
│   ├── prettier.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── docs/                           # Tài liệu dự án
│   ├── HUONG_DAN.md
│   └── PROJECT_STRUCTURE.md
├── public/                         # Tài nguyên tĩnh
│   └── favicon.svg
├── src/                            # Mã nguồn ứng dụng
│   ├── app/                        # Khởi tạo ứng dụng, giao diện và theme
│   │   ├── App.tsx
│   │   ├── AppearanceProvider.tsx
│   │   ├── appearance.ts
│   │   └── theme.ts
│   ├── components/                 # Các thành phần giao diện
│   │   ├── AIChatPanel.tsx
│   │   ├── ExperimentScene.tsx
│   │   ├── ExperimentSidebar.tsx
│   │   └── MainLayout.tsx
│   ├── hooks/                      # Hook và trạng thái dùng chung
│   │   ├── useAppearance.ts
│   │   ├── useChatState.ts
│   │   └── useExperiments.ts
│   ├── pages/                      # Nội dung theo từng trang
│   │   ├── ExperimentPage.tsx
│   │   ├── HelpPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/                   # Truy cập và cập nhật dữ liệu
│   │   └── experiments.ts
│   ├── test/                       # Thiết lập và kiểm thử
│   │   ├── appearance.test.tsx
│   │   └── setup.ts
│   ├── types/                      # Kiểu dữ liệu TypeScript
│   │   └── experiment.ts
│   ├── main.tsx                    # Điểm khởi chạy React
│   ├── styles.css                  # CSS chung và responsive
│   └── vite-env.d.ts               # Kiểu môi trường Vite
├── .gitignore                      # Tệp không đưa vào Git
├── index.html                      # HTML đầu vào của Vite
├── package.json                    # Scripts và dependency
├── package-lock.json               # Khóa phiên bản dependency
├── README.md                       # Hướng dẫn tổng quan
└── tsconfig.json                   # Tham chiếu cấu hình TypeScript
```

## Vai trò các thư mục

| Thư mục | Trách nhiệm |
| --- | --- |
| `config/` | Cấu hình Vite, TypeScript, lint, định dạng và kiểm thử |
| `src/app/` | Routing, theme và khởi tạo các provider |
| `src/components/` | Layout và các thành phần giao diện có thể tái sử dụng |
| `src/hooks/` | Logic React và trạng thái dùng chung |
| `src/pages/` | Nội dung gắn với từng route |
| `src/services/` | Đọc và cập nhật dữ liệu, tách khỏi giao diện |
| `src/types/` | Kiểu dữ liệu nghiệp vụ |
| `src/test/` | Kiểm thử và thiết lập môi trường kiểm thử |

## Quy ước

- Tên thư mục dùng chữ thường; tên component React dùng `PascalCase`.
- Tên hook dùng `camelCase` với tiền tố `use`, ví dụ `useExperiments`.
- Hàm và biến dùng `camelCase`; kiểu và interface dùng `PascalCase`.
- Giữ `package.json`, lockfile, `index.html` và các tệp cấu hình gốc tại vị trí hiện tại để công cụ nhận diện dự án.
- `node_modules/` và `dist/` là thư mục sinh tự động, không cần đưa vào gói mã nguồn.