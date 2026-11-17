import useSWR from 'swr'
import { getExperiments } from '../services/experiments'

export const EXPERIMENTS_KEY = 'experiments'
export function useExperiments() {
  return useSWR(EXPERIMENTS_KEY, getExperiments)
}
