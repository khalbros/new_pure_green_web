export interface IReduxState<T> {
  data?: T
  isLoading?: boolean
  error?: boolean
  message?: string
  createdAt?: string
  updatedAt?: string
}
