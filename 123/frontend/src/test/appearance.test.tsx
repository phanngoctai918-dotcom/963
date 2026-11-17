import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTheme } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import AppearanceProvider from '../app/AppearanceProvider'
import { APPEARANCE_STORAGE_KEY, appearancePalettes } from '../app/appearance'
import SettingsPage from '../pages/SettingsPage'
import App from '../app/App'

function ThemeProbe() {
  const theme = useTheme()
  return (
    <output aria-label="Giao diện hiện tại">
      {theme.palette.mode}:{theme.palette.background.default}
    </output>
  )
}

function renderSettings() {
  return render(
    <AppearanceProvider>
      <SWRConfig value={{ provider: () => new Map(), errorRetryCount: 0 }}>
        <SettingsPage />
        <ThemeProbe />
      </SWRConfig>
    </AppearanceProvider>,
  )
}

describe('Cài đặt màu nền', () => {
  it('chọn nền xám nhạt mặc định khi chưa có lựa chọn', () => {
    renderSettings()
    expect((screen.getByRole('radio', { name: 'Xám nhạt' }) as HTMLInputElement).checked).toBe(true)
    expect(screen.getByLabelText('Giao diện hiện tại').textContent).toBe('light:#f7f7f7')
  })

  it('bấm từng màu cập nhật MUI, CSS variables, trạng thái radio và localStorage', async () => {
    const user = userEvent.setup()
    renderSettings()
    for (const [name, id] of [
      ['Đen', 'dark'],
      ['Trắng', 'white'],
      ['Xám đậm', 'gray'],
      ['Xám nhạt', 'light'],
    ] as const) {
      await user.click(screen.getByRole('radio', { name }))
      const palette = appearancePalettes[id]
      expect((screen.getByRole('radio', { name }) as HTMLInputElement).checked).toBe(true)
      expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe(id)
      expect(screen.getByLabelText('Giao diện hiện tại').textContent).toBe(
        `${palette.mode}:${palette.background}`,
      )
      await waitFor(() => {
        const styles = getComputedStyle(document.documentElement)
        expect(styles.getPropertyValue('--app-bg').trim()).toBe(palette.background)
        expect(styles.getPropertyValue('--scene-bg').trim()).toBe(palette.scene)
      })
    }
  })

  it('giữ màu nền khi khởi tạo ứng dụng lại như sau khi tải lại trang', async () => {
    const user = userEvent.setup()
    const first = renderSettings()
    await user.click(screen.getByRole('radio', { name: 'Đen' }))
    first.unmount()
    renderSettings()
    expect((screen.getByRole('radio', { name: 'Đen' }) as HTMLInputElement).checked).toBe(true)
    expect(screen.getByLabelText('Giao diện hiện tại').textContent).toBe('dark:#121212')
  })

  it('dùng mặc định an toàn khi giá trị lưu không hợp lệ', () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, 'invalid-value')
    renderSettings()
    expect((screen.getByRole('radio', { name: 'Xám nhạt' }) as HTMLInputElement).checked).toBe(true)
  })

  it('hỗ trợ đổi lựa chọn bằng phím mũi tên', async () => {
    const user = userEvent.setup()
    renderSettings()
    screen.getByRole('radio', { name: 'Xám nhạt' }).focus()
    await user.keyboard('{ArrowRight}')
    expect((screen.getByRole('radio', { name: 'Xám đậm' }) as HTMLInputElement).checked).toBe(true)
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('gray')
  })

  it('vẫn áp dụng màu cho phiên hiện tại khi trình duyệt chặn ghi dữ liệu', async () => {
    const user = userEvent.setup()
    renderSettings()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })
    await user.click(screen.getByRole('radio', { name: 'Đen' }))
    expect(screen.getByLabelText('Giao diện hiện tại').textContent).toBe('dark:#121212')
    expect(screen.getByRole('alert').textContent).toContain('chặn lưu lựa chọn')
  })

  it('khởi động được khi không thể đọc localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })
    renderSettings()
    expect((screen.getByRole('radio', { name: 'Xám nhạt' }) as HTMLInputElement).checked).toBe(true)
  })

  it('khung ứng dụng vẫn đổi nền và không còn nhãn Bản xem trước', async () => {
    const user = userEvent.setup()
    render(
      <AppearanceProvider>
        <SWRConfig value={{ provider: () => new Map(), errorRetryCount: 0 }}>
          <MemoryRouter initialEntries={['/settings']}>
            <App />
            <ThemeProbe />
          </MemoryRouter>
        </SWRConfig>
      </AppearanceProvider>,
    )
    expect(await screen.findByRole('link', { name: /3D MLOps Copilot Platform/ })).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: 'Đen' }))
    expect(screen.getByLabelText('Giao diện hiện tại').textContent).toBe('dark:#121212')
    expect(screen.queryByText('Bản xem trước')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Trợ lý AI' })).toBeTruthy()
  })
})
