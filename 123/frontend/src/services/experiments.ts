import type { Experiment } from '../types/experiment'

const STORAGE_KEY = 'latent.experiments.v1'
const sampleExperiments: Experiment[] = [
  {
    id: 'exp-001',
    name: 'Phân loại hình ảnh',
    model: 'ResNet-50',
    dataset: 'CIFAR-10',
    status: 'completed',
    accuracy: 94.82,
    loss: 0.146,
    epochs: 100,
    totalEpochs: 100,
    learningRate: 0.001,
    batchSize: 32,
    createdAt: '2026-11-16T02:00:00Z',
  },
  {
    id: 'exp-002',
    name: 'Nhận diện đối tượng',
    model: 'YOLOv8',
    dataset: 'COCO 128',
    status: 'running',
    accuracy: 89.34,
    loss: 0.284,
    epochs: 42,
    totalEpochs: 80,
    learningRate: 0.0005,
    batchSize: 16,
    createdAt: '2026-11-16T03:00:00Z',
  },
  {
    id: 'exp-003',
    name: 'Phân tích cảm xúc',
    model: 'BERT-base',
    dataset: 'IMDb',
    status: 'completed',
    accuracy: 92.61,
    loss: 0.193,
    epochs: 10,
    totalEpochs: 10,
    learningRate: 0.00002,
    batchSize: 16,
    createdAt: '2026-11-15T01:00:00Z',
  },
  {
    id: 'exp-004',
    name: 'Phân cụm dữ liệu',
    model: 'Autoencoder',
    dataset: 'MNIST',
    status: 'queued',
    accuracy: null,
    loss: null,
    epochs: 0,
    totalEpochs: 50,
    learningRate: 0.001,
    batchSize: 64,
    createdAt: '2026-11-16T04:00:00Z',
  },
]

function isExperiment(value: unknown): value is Experiment {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    ['id', 'name', 'model', 'dataset', 'createdAt'].every((key) => typeof item[key] === 'string') &&
    ['running', 'completed', 'queued'].includes(String(item.status)) &&
    ['epochs', 'totalEpochs', 'learningRate', 'batchSize'].every(
      (key) => typeof item[key] === 'number' && Number.isFinite(item[key]),
    ) &&
    ['accuracy', 'loss'].every(
      (key) => item[key] === null || (typeof item[key] === 'number' && Number.isFinite(item[key])),
    )
  )
}

// Adapter dữ liệu demo. Thay bằng fetch('/api/experiments') khi nối backend.
export async function getExperiments(): Promise<Experiment[]> {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return sampleExperiments.map((item) => ({ ...item }))
  try {
    const items: unknown = JSON.parse(raw)
    if (!Array.isArray(items) || !items.every(isExperiment)) throw new Error('Invalid data')
    return items
  } catch {
    throw new Error('Dữ liệu cục bộ không hợp lệ. Khôi phục dữ liệu mẫu trong Cài đặt.')
  }
}

export async function createExperiment(
  input: Pick<Experiment, 'name' | 'model' | 'dataset'>,
): Promise<Experiment> {
  if (!input.name.trim() || !input.dataset.trim()) throw new Error('Nhập tên và bộ dữ liệu.')
  const item: Experiment = {
    ...input,
    name: input.name.trim(),
    dataset: input.dataset.trim(),
    id: `exp-${crypto.randomUUID()}`,
    status: 'queued',
    accuracy: null,
    loss: null,
    epochs: 0,
    totalEpochs: 50,
    learningRate: 0.001,
    batchSize: 32,
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...(await getExperiments()), item]))
  return item
}

export async function resetExperiments(): Promise<Experiment[]> {
  localStorage.removeItem(STORAGE_KEY)
  return getExperiments()
}
