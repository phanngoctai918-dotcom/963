import { useEffect, useRef } from 'react'
import { Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import type { Experiment } from '../types/experiment'
import { useChatState } from '../hooks/useChatState'

const prompts = ['Phân tích kết quả', 'Giải thích loss', 'Gợi ý bước tiếp theo']

function reply(question: string, experiment?: Experiment) {
  if (!experiment)
    return 'Phản hồi mẫu: chọn một thực nghiệm ở thanh bên để xem thông tin tương ứng.'
  if (question.toLocaleLowerCase('vi').includes('loss'))
    return `Phản hồi mẫu: loss đo mức sai lệch giữa dự đoán và giá trị thực tế. Loss của ${experiment.name} là ${experiment.loss ?? 'chưa có'}. Hãy so sánh thêm loss trên tập validation để đánh giá mô hình.`
  if (question.toLocaleLowerCase('vi').includes('tiếp theo'))
    return `Phản hồi mẫu: với ${experiment.model}, bạn có thể kiểm tra cách chia tập dữ liệu ${experiment.dataset}, thử learning rate khác và so sánh accuracy cùng loss trên tập validation.`
  return `Phản hồi mẫu: ${experiment.name} sử dụng ${experiment.model} trên ${experiment.dataset}.\n\nAccuracy: ${experiment.accuracy === null ? 'chưa có' : `${experiment.accuracy.toFixed(2)}%`}\nLoss: ${experiment.loss ?? 'chưa có'}\nEpoch: ${experiment.epochs}/${experiment.totalEpochs}`
}

export default function AIChatPanel({ experiment }: { experiment?: Experiment }) {
  const key = experiment?.id ?? 'workspace'
  const { history, setHistory, drafts, setDrafts } = useChatState()
  const logRef = useRef<HTMLDivElement>(null)
  const messages = history[key] ?? []
  const draft = drafts[key] ?? ''

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [key, messages.length])

  function send(text: string) {
    const question = text.trim()
    if (!question) return
    setHistory((current) => ({
      ...current,
      [key]: [
        ...(current[key] ?? []),
        { role: 'user', content: question },
        { role: 'assistant', content: reply(question, experiment) },
      ],
    }))
    setDrafts((current) => ({ ...current, [key]: '' }))
  }

  return (
    <Box
      component="aside"
      aria-label="Khung chat AI"
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--surface)',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.75,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AutoAwesomeOutlined sx={{ fontSize: 21 }} />
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 650 }}>
          Trợ lý AI
        </Typography>
      </Box>

      <Box
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Nội dung cuộc trò chuyện"
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, py: 2.5 }}
      >
        {experiment && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              p: 1.5,
              mb: 3,
              border: '1px solid var(--border)',
              borderRadius: 2,
              bgcolor: 'var(--surface-muted)',
            }}
          >
            <ScienceOutlined sx={{ fontSize: 19, mt: 0.15, color: 'var(--text-secondary)' }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, overflowWrap: 'anywhere' }}>
                {experiment.name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.4 }}>
                {experiment.model} · {experiment.dataset}
              </Typography>
            </Box>
          </Box>
        )}

        {messages.length === 0 && (
          <Box sx={{ pt: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: 'var(--surface-muted)',
                display: 'grid',
                placeItems: 'center',
                mb: 2,
              }}
            >
              <AutoAwesomeOutlined sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.5px',
                lineHeight: 1.4,
                mb: 1.25,
              }}
            >
              Tôi có thể giúp gì cho bạn?
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
              Phân tích kết quả hoặc tìm hiểu mô hình đang chọn.
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outlined"
                  onClick={() => send(prompt)}
                  endIcon={<ArrowOutwardRounded sx={{ fontSize: '16px !important' }} />}
                  sx={{
                    justifyContent: 'space-between',
                    fontSize: 13,
                    fontWeight: 500,
                    px: 1.5,
                    py: 1.15,
                    borderColor: 'var(--border)',
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {messages.map((message, index) => (
          <Box key={`${key}-${index}`} sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary', mb: 0.8 }}>
              {message.role === 'user' ? 'Bạn' : 'Trợ lý AI'}
            </Typography>
            <Box
              sx={{
                p: 1.75,
                borderRadius: 2,
                bgcolor: message.role === 'user' ? 'var(--surface-hover)' : 'var(--surface-muted)',
                border: message.role === 'assistant' ? '1px solid var(--border)' : undefined,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {message.content}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2.25, borderTop: '1px solid var(--border)' }}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
          sx={{
            border: '1px solid var(--border)',
            borderRadius: 2.5,
            p: 1.5,
            '&:focus-within': { borderColor: 'var(--text-secondary)' },
          }}
        >
          <TextField
            multiline
            minRows={2}
            maxRows={5}
            fullWidth
            variant="standard"
            placeholder="Hỏi về thực nghiệm…"
            value={draft}
            onChange={(event) =>
              setDrafts((current) => ({ ...current, [key]: event.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                send(draft)
              }
            }}
            slotProps={{
              input: { disableUnderline: true, sx: { fontSize: 13 } },
              htmlInput: { 'aria-label': 'Tin nhắn cho trợ lý AI', maxLength: 2000 },
            }}
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
          >
            <Tooltip title="Enter để gửi · Shift + Enter để xuống dòng">
              <IconButton
                size="small"
                aria-label="Hướng dẫn nhập tin nhắn"
                sx={{ color: 'var(--text-secondary)' }}
              >
                <InfoOutlined sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gửi tin nhắn">
              <span>
                <IconButton
                  type="submit"
                  aria-label="Gửi tin nhắn"
                  disabled={!draft.trim()}
                  sx={{
                    bgcolor: 'var(--strong)',
                    color: 'var(--on-strong)',
                    borderRadius: 1.5,
                    width: 32,
                    height: 32,
                    '&:hover': { bgcolor: 'var(--strong)', opacity: 0.85 },
                    '&.Mui-disabled': {
                      bgcolor: 'var(--surface-hover)',
                      color: 'var(--text-secondary)',
                    },
                  }}
                >
                  <ArrowUpwardRounded sx={{ fontSize: 19 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
