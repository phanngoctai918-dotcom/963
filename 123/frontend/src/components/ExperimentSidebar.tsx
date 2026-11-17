import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded'
import { useExperiments } from '../hooks/useExperiments'
import { createExperiment } from '../services/experiments'

const statusLabels = { running: 'Đang chạy', completed: 'Hoàn thành', queued: 'Chờ chạy' }

export default function ExperimentSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { data, error, isLoading, mutate } = useExperiments()
  const { experimentId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [runningOnly, setRunningOnly] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [model, setModel] = useState('ResNet-50')
  const [dataset, setDataset] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const experiments = data?.filter(
    (item) =>
      (!runningOnly || item.status === 'running') &&
      `${item.name} ${item.model} ${item.dataset}`
        .toLocaleLowerCase('vi')
        .includes(query.trim().toLocaleLowerCase('vi')),
  )

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const cleanName = name.trim()
    const cleanDataset = dataset.trim()
    if (!cleanName || !cleanDataset) {
      setFormError('Vui lòng nhập tên thực nghiệm và bộ dữ liệu.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const experiment = await createExperiment({ name: cleanName, model, dataset: cleanDataset })
      await mutate()
      setOpen(false)
      setName('')
      setDataset('')
      setQuery('')
      setRunningOnly(false)
      navigate(`/experiments/${experiment.id}`)
      onNavigate?.()
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : 'Không thể lưu thực nghiệm. Vui lòng thử lại.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box
      component="aside"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        bgcolor: 'var(--surface)',
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 650 }}>
            Thực nghiệm
          </Typography>
          <Chip size="small" label={data?.length ?? '—'} sx={{ height: 22, fontSize: 12 }} />
        </Box>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRounded />}
          sx={{ mb: 2 }}
          onClick={() => {
            setFormError('')
            setOpen(true)
          }}
        >
          Tạo thực nghiệm
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm thực nghiệm…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            htmlInput: { 'aria-label': 'Tìm thực nghiệm' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ '& .MuiInputBase-root': { fontSize: 13, bgcolor: 'var(--surface-muted)' } }}
        />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
          <Button
            size="small"
            aria-pressed={!runningOnly}
            onClick={() => setRunningOnly(false)}
            sx={{ fontSize: 12, bgcolor: !runningOnly ? 'var(--surface-hover)' : 'transparent' }}
          >
            Tất cả
          </Button>
          <Button
            size="small"
            aria-pressed={runningOnly}
            onClick={() => setRunningOnly(true)}
            sx={{ fontSize: 12, bgcolor: runningOnly ? 'var(--surface-hover)' : 'transparent' }}
          >
            Đang chạy
          </Button>
        </Box>
      </Box>
      <Box
        component="nav"
        aria-label="Danh sách thực nghiệm"
        sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1.5 }}
      >
        {isLoading && (
          <CircularProgress
            color="inherit"
            size={22}
            sx={{ m: 2 }}
            aria-label="Đang tải thực nghiệm"
          />
        )}
        {error && (
          <Alert
            severity="error"
            sx={{ fontSize: 12 }}
            action={
              <Button size="small" onClick={() => void mutate()}>
                Thử lại
              </Button>
            }
          >
            Không tải được thực nghiệm.
          </Alert>
        )}
        {!isLoading && !error && experiments?.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
            Không tìm thấy thực nghiệm.
          </Typography>
        )}
        {experiments?.map((item) => (
          <Box
            key={item.id}
            component={Link}
            to={`/experiments/${item.id}`}
            onClick={onNavigate}
            aria-current={experimentId === item.id ? 'page' : undefined}
            sx={{
              display: 'block',
              color: 'inherit',
              textDecoration: 'none',
              p: 1.5,
              mb: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: experimentId === item.id ? 'var(--border)' : 'transparent',
              bgcolor: experimentId === item.id ? 'var(--surface-hover)' : 'var(--surface)',
              '&:hover': { bgcolor: 'var(--surface-muted)' },
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <ScienceOutlined sx={{ fontSize: 19 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{item.name}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.3 }}>
              {item.model} · {item.dataset}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box
                component="span"
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor:
                    item.status === 'completed' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {statusLabels[item.status]}
              </Typography>
              {item.accuracy !== null && (
                <Typography sx={{ ml: 'auto', fontSize: 12, fontFamily: 'monospace' }}>
                  {item.accuracy.toFixed(2)}%
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2.5, flexShrink: 0, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          component={Link}
          to="/settings"
          fullWidth
          startIcon={<SettingsOutlined sx={{ fontSize: 17 }} />}
          onClick={onNavigate}
          sx={{ justifyContent: 'flex-start', fontSize: 12 }}
        >
          Cài đặt
        </Button>
        <Button
          component={Link}
          to="/help"
          fullWidth
          startIcon={<HelpOutlineRounded sx={{ fontSize: 17 }} />}
          onClick={onNavigate}
          sx={{ justifyContent: 'flex-start', fontSize: 12 }}
        >
          Hướng dẫn sử dụng
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          if (!saving) setOpen(false)
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="create-experiment-title"
      >
        <Box component="form" onSubmit={handleCreate}>
          <DialogTitle id="create-experiment-title">Tạo thực nghiệm</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: '12px !important' }}>
            <Typography variant="body2" color="text.secondary">
              Tạo cấu hình thực nghiệm và lưu trong không gian làm việc của bạn.
            </Typography>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              autoFocus
              fullWidth
              required
              label="Tên thực nghiệm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={saving}
              slotProps={{ htmlInput: { maxLength: 80 } }}
            />
            <TextField
              select
              fullWidth
              label="Mô hình"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              disabled={saving}
            >
              {['ResNet-50', 'YOLOv8', 'BERT-base', 'Autoencoder'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              required
              label="Bộ dữ liệu"
              value={dataset}
              onChange={(event) => setDataset(event.target.value)}
              disabled={saving}
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !name.trim() || !dataset.trim()}
            >
              {saving ? 'Đang lưu…' : 'Tạo thực nghiệm'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}
