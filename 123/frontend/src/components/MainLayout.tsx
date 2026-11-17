import { useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { Box, Button, Drawer, IconButton, Tooltip } from '@mui/material'
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined'
import MenuRounded from '@mui/icons-material/MenuRounded'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import CloseRounded from '@mui/icons-material/CloseRounded'
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded'
import ExperimentSidebar from './ExperimentSidebar'
import AIChatPanel from './AIChatPanel'
import { useExperiments } from '../hooks/useExperiments'
import { ChatStateContext, type ChatHistory, type ChatDrafts } from '../hooks/useChatState'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [history, setHistory] = useState<ChatHistory>({})
  const [drafts, setDrafts] = useState<ChatDrafts>({})
  const { experimentId } = useParams()
  const { data } = useExperiments()
  const experiment = data?.find((item) => item.id === experimentId)

  return (
    <ChatStateContext.Provider value={{ history, setHistory, drafts, setDrafts }}>
      <Box className="app-shell">
        <a href="#main-content" className="skip-link">
          Chuyển đến nội dung chính
        </a>
        <Box component="header" className="app-header">
          <IconButton
            className="mobile-menu"
            aria-label="Mở danh sách thực nghiệm"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuRounded />
          </IconButton>
          <Link className="brand" to="/" aria-label="3D MLOps Copilot Platform — Trang chủ">
            <span className="brand-icon">
              <ViewInArOutlined />
            </span>
            <span className="brand-name">3D MLOps Copilot Platform</span>
          </Link>
          <Box sx={{ flex: 1 }} />
          <Button
            component={Link}
            to="/help"
            className="docs-button"
            startIcon={<HelpOutlineRounded />}
            sx={{ fontSize: 13, color: 'text.secondary' }}
          >
            Hướng dẫn
          </Button>
          <Tooltip title="Mở trợ lý AI">
            <IconButton
              className="mobile-chat"
              aria-label="Mở khung chat AI"
              onClick={() => setChatOpen(true)}
            >
              <AutoAwesomeOutlined />
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="workspace-grid">
          <Box className="desktop-sidebar">
            <ExperimentSidebar />
          </Box>
          <Box component="main" id="main-content" tabIndex={-1} className="main-content">
            <Outlet />
          </Box>
          <Box className="desktop-chat">
            <AIChatPanel experiment={experiment} />
          </Box>
        </Box>
        <Drawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          slotProps={{ paper: { sx: { width: 290, maxWidth: '90vw' } } }}
        >
          <IconButton
            aria-label="Đóng danh sách thực nghiệm"
            onClick={() => setSidebarOpen(false)}
            sx={{ alignSelf: 'flex-end', m: 1 }}
          >
            <CloseRounded />
          </IconButton>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ExperimentSidebar onNavigate={() => setSidebarOpen(false)} />
          </Box>
        </Drawer>
        <Drawer
          anchor="right"
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{ paper: { sx: { width: 370, maxWidth: '100vw' } } }}
        >
          <IconButton
            aria-label="Đóng khung chat AI"
            onClick={() => setChatOpen(false)}
            sx={{ alignSelf: 'flex-end', m: 1 }}
          >
            <CloseRounded />
          </IconButton>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <AIChatPanel experiment={experiment} />
          </Box>
        </Drawer>
      </Box>
    </ChatStateContext.Provider>
  )
}
