import { Box, Paper, Typography } from '@mui/material'

export default function HelpPage() {
  const steps = [
    [
      '01',
      'Chọn thực nghiệm',
      'Tìm kiếm và chọn thực nghiệm ở Sidebar. URL, chỉ số trung tâm và ngữ cảnh chat cùng thay đổi theo ID.',
    ],
    [
      '02',
      'Khám phá không gian 3D',
      'Kéo chuột để xoay và cuộn để thu phóng. Nút Top đổi góc nhìn từ trên, nút lưới bật/tắt lưới và nút đặt lại khôi phục góc nhìn. Cảnh hiện dùng dữ liệu 3D minh họa.',
    ],
    [
      '03',
      'Xem thông số',
      'Tab Thông số hiển thị mô hình, bộ dữ liệu và siêu tham số. Accuracy, Loss và Epoch là số liệu mẫu, chưa cập nhật theo huấn luyện thật.',
    ],
    [
      '04',
      'Thử khung chat AI',
      'Nhập câu hỏi rồi nhấn Enter; Shift + Enter để xuống dòng. Phản hồi hiện được tạo theo kịch bản mẫu; lịch sử và bản nháp được giữ khi chuyển giữa desktop và màn hình nhỏ.',
    ],
    [
      '05',
      'Tiếp tục phát triển',
      'Đọc docs/HUONG_DAN.md để xem từng phần React, TypeScript, MUI, SWR, routing và layout. Kết nối backend trong src/services/experiments.ts.',
    ],
  ]
  return (
    <Box className="info-page">
      <Typography variant="h4" sx={{ mt: 1, mb: 3 }}>
        Hướng dẫn sử dụng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        3D MLOps Copilot Platform giúp bạn theo dõi thực nghiệm, khám phá không gian 3D và trao đổi
        với trợ lý AI. Bản hiện tại sử dụng dữ liệu mẫu và phản hồi theo kịch bản.
      </Typography>
      {steps.map(([number, title, text]) => (
        <Paper variant="outlined" key={number} sx={{ display: 'flex', gap: 2, p: 2.5, mb: 1.5 }}>
          <Typography
            className="mono"
            sx={{ fontSize: 12, color: 'var(--text-secondary)', pt: 0.4 }}
          >
            {number}
          </Typography>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.7 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  )
}
