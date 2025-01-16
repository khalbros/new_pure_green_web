/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBundle {
  _id?: string
  name?: string
  total?: string
  inputs?: any[]
  createdAt?: string
  updatedAt?: string
}
export interface IBundleInput {
  input: string
  quantity: string
}
