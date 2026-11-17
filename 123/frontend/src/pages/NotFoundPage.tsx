import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Box className="center-state">
      <Typography className="mono" color="text.secondary">
        404 / KHÔNG TÌM THẤY
      </Typography>
      <Typography variant="h5">Trang hoặc thực nghiệm không tồn tại</Typography>
      <Typography variant="body2" color="text.secondary">
        Chọn một thực nghiệm trong Sidebar để tiếp tục.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Về không gian làm việc
      </Button>
    </Box>
  )
}
