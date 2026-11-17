import { lazy, Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import GridOnOutlined from '@mui/icons-material/GridOnOutlined'
import RestartAltRounded from '@mui/icons-material/RestartAltRounded'
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { useExperiments } from '../hooks/useExperiments'
import { statusLabels } from '../types/experiment'
import NotFoundPage from './NotFoundPage'

const ExperimentScene = lazy(() => import('../components/ExperimentScene'))

export default function ExperimentPage() {
  const { experimentId } = useParams()
  const { data, error, isLoading, mutate } = useExperiments()
  const [tab, setTab] = useState<'space' | 'parameters'>('space')
  const [view, setView] = useState<'space' | 'top'>('space')
  const [showGrid, setShowGrid] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const experiment = data?.find((item) => item.id === experimentId)
  if (isLoading)
    return (
      <Box className="center-state">
        <CircularProgress color="inherit" size={28} />
        <Typography>Đang tải thực nghiệm…</Typography>
      </Box>
    )
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={() => void mutate()}>
            Thử lại
          </Button>
        }
      >
        Không tải được thực nghiệm.
      </Alert>
    )
  if (!experiment) return <NotFoundPage />
  const parameters = [
    ['Mô hình', experiment.model],
    ['Bộ dữ liệu', experiment.dataset],
    ['Learning rate', experiment.learningRate],
    ['Batch size', experiment.batchSize],
    ['Số epoch', experiment.totalEpochs],
    ['Trạng thái', statusLabels[experiment.status]],
  ]

  return (
    <Box className="experiment-page">
      <Box className="page-heading">
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h1" variant="h4" sx={{ overflowWrap: 'anywhere' }}>
            {experiment.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, fontSize: 14 }}>
            {experiment.model} <span className="subtitle-divider">/</span> {experiment.dataset}
          </Typography>
        </Box>
        <Chip
          className="experiment-state"
          label={statusLabels[experiment.status]}
          icon={<span className={`status-dot ${experiment.status}`} />}
          variant="outlined"
          sx={{
            bgcolor: 'var(--surface)',
            fontSize: 12,
            px: 0.5,
            '& .MuiChip-icon': { ml: 1.5, mr: 0.1 },
          }}
        />
      </Box>
      <Box className="workspace-tabs" role="tablist" aria-label="Nội dung thực nghiệm">
        <Button
          role="tab"
          aria-selected={tab === 'space'}
          aria-controls="experiment-panel"
          id="space-tab"
          className={tab === 'space' ? 'active' : ''}
          startIcon={<ViewInArOutlined />}
          onClick={() => setTab('space')}
        >
          Không gian 3D
        </Button>
        <Button
          role="tab"
          aria-selected={tab === 'parameters'}
          aria-controls="experiment-panel"
          id="parameters-tab"
          className={tab === 'parameters' ? 'active' : ''}
          startIcon={<TuneOutlined />}
          onClick={() => setTab('parameters')}
        >
          Thông số
        </Button>
      </Box>
      <Box
        role="tabpanel"
        id="experiment-panel"
        aria-labelledby={tab === 'space' ? 'space-tab' : 'parameters-tab'}
        className="experiment-tab-panel"
      >
        {tab === 'space' ? (
          <Paper variant="outlined" className="scene-panel">
            <Box className="scene-toolbar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Mô hình trực quan</Typography>
                <Tooltip title="Kéo để xoay, cuộn để thu phóng. Cảnh 3D hiện sử dụng dữ liệu minh họa.">
                  <IconButton size="small" aria-label="Hướng dẫn xem không gian 3D">
                    <InfoOutlined sx={{ fontSize: 17, color: 'var(--text-secondary)' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={view}
                  onChange={(_, value: 'space' | 'top' | null) => value && setView(value)}
                  aria-label="Góc nhìn"
                >
                  <ToggleButton value="space" aria-label="Góc nhìn 3D">
                    3D
                  </ToggleButton>
                  <ToggleButton value="top" aria-label="Góc nhìn từ trên">
                    Top
                  </ToggleButton>
                </ToggleButtonGroup>
                <Tooltip title={showGrid ? 'Ẩn lưới' : 'Hiện lưới'}>
                  <IconButton
                    size="small"
                    aria-label="Bật tắt lưới"
                    aria-pressed={showGrid}
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <GridOnOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Đặt lại góc nhìn">
                  <IconButton
                    size="small"
                    aria-label="Đặt lại góc nhìn"
                    onClick={() => setResetKey((key) => key + 1)}
                  >
                    <RestartAltRounded sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box className="scene-container">
              <Suspense
                fallback={
                  <Box className="center-state">
                    <CircularProgress color="inherit" size={26} />
                    <Typography variant="body2">Đang mở không gian 3D…</Typography>
                  </Box>
                }
              >
                <ExperimentScene
                  experimentId={experiment.id}
                  view={view}
                  showGrid={showGrid}
                  resetKey={resetKey}
                />
              </Suspense>
            </Box>
          </Paper>
        ) : (
          <Paper variant="outlined" className="parameters-panel">
            <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600, mb: 2 }}>
              Cấu hình thực nghiệm
            </Typography>
            {parameters.map(([label, value]) => (
              <Box key={label} className="parameter-row">
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" className="mono">
                  {value}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
      <Box className="metrics-grid">
        <Paper variant="outlined" className="metric-card">
          <Typography className="metric-label">Độ chính xác</Typography>
          <Typography className="metric-value">
            {experiment.accuracy?.toFixed(2) ?? '—'}
            <span>{experiment.accuracy === null ? '' : '%'}</span>
          </Typography>
        </Paper>
        <Paper variant="outlined" className="metric-card">
          <Typography className="metric-label">Loss</Typography>
          <Typography className="metric-value">{experiment.loss?.toFixed(3) ?? '—'}</Typography>
        </Paper>
        <Paper variant="outlined" className="metric-card">
          <Typography className="metric-label">Epoch</Typography>
          <Typography className="metric-value">
            {experiment.epochs}
            <span>/ {experiment.totalEpochs}</span>
          </Typography>
          <LinearProgress
            color="inherit"
            variant="determinate"
            value={experiment.totalEpochs ? (experiment.epochs / experiment.totalEpochs) * 100 : 0}
            sx={{ height: 3, borderRadius: 3, bgcolor: 'var(--surface-hover)' }}
          />
        </Paper>
      </Box>
    </Box>
  )
}
