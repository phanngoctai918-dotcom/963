import { useState } from 'react'
import { Alert, Box, Button, Paper, Typography } from '@mui/material'
import { useExperiments } from '../hooks/useExperiments'
import { resetExperiments } from '../services/experiments'
import { appearanceOptions } from '../app/appearance'
import { useAppearance } from '../hooks/useAppearance'

export default function SettingsPage() {
  const { appearance, setAppearance, persistenceError } = useAppearance()
  const { mutate } = useExperiments()
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  async function reset() {
    try {
      const restored = await resetExperiments()
      await mutate(restored, false)
      setFailed(false)
      setMessage('Đã khôi phục dữ liệu mẫu.')
    } catch {
      setFailed(true)
      setMessage('Không thể truy cập dữ liệu cục bộ.')
    }
  }
  return (
    <Box className="info-page">
      <Typography variant="h4" sx={{ mt: 1, mb: 3 }}>
        Cài đặt không gian
      </Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box
          component="fieldset"
          role="radiogroup"
          aria-labelledby="appearance-title"
          sx={{ m: 0, p: 0, border: 0, minWidth: 0 }}
        >
          <Typography component="legend" id="appearance-title" sx={{ fontWeight: 600, mb: 1 }}>
            Màu nền
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Chọn màu nền cho không gian làm việc. Lựa chọn được áp dụng ngay và ghi nhớ trên trình
            duyệt này.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
              gap: 1.5,
            }}
          >
            {appearanceOptions.map((option) => (
              <Box
                component="label"
                key={option.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  border: '1px solid',
                  borderColor: appearance === option.id ? 'text.primary' : 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: appearance === option.id ? 'action.selected' : 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:focus-within': {
                    outline: '2px solid',
                    outlineColor: 'text.primary',
                    outlineOffset: 3,
                  },
                }}
              >
                <input
                  type="radio"
                  name="appearance"
                  value={option.id}
                  checked={appearance === option.id}
                  onChange={() => setAppearance(option.id)}
                  aria-label={option.label}
                  style={{
                    width: 16,
                    height: 16,
                    margin: 0,
                    accentColor: 'var(--strong)',
                    flexShrink: 0,
                  }}
                />
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    bgcolor: option.preview,
                    border: '1px solid #999',
                    borderRadius: '50%',
                  }}
                />
                <Typography sx={{ fontSize: 13, fontWeight: appearance === option.id ? 600 : 400 }}>
                  {option.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {persistenceError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Màu nền đã được áp dụng, nhưng trình duyệt đang chặn lưu lựa chọn. Khi tải lại trang,
            màu nền có thể trở về mặc định.
          </Alert>
        )}
        <Typography sx={{ fontWeight: 600, mt: 4, mb: 1 }}>Dữ liệu thực nghiệm</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Bản mẫu lưu dữ liệu trong trình duyệt. Khôi phục sẽ xóa các thực nghiệm bạn đã tạo trong
          bản demo.
        </Typography>
        <Button variant="outlined" onClick={() => void reset()}>
          Khôi phục dữ liệu mẫu
        </Button>
        {message && (
          <Alert severity={failed ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <Typography sx={{ fontWeight: 600, mt: 4, mb: 1 }}>Kết nối</Typography>
        <Typography variant="body2" color="text.secondary">
          API thực nghiệm: dữ liệu mẫu cục bộ.
          <br />
          Chat AI: phản hồi demo theo mẫu, chưa kết nối LLM.
          <br />
          Không gian 3D: mô phỏng trực quan bằng Three.js.
        </Typography>
      </Paper>
    </Box>
  )
}
