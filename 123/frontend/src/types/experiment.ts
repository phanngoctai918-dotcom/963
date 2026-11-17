export type ExperimentStatus = 'running' | 'completed' | 'queued'
export interface Experiment {
  id: string
  name: string
  model: string
  dataset: string
  status: ExperimentStatus
  accuracy: number | null
  loss: number | null
  epochs: number
  totalEpochs: number
  learningRate: number
  batchSize: number
  createdAt: string
}
export const statusLabels: Record<ExperimentStatus, string> = {
  running: 'Đang chạy',
  completed: 'Hoàn thành',
  queued: 'Chờ chạy',
}
