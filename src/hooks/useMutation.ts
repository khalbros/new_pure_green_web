/* eslint-disable @typescript-eslint/no-explicit-any */
import {useReducer} from "react"
import {http} from "../utils"

interface IMutationState {
  data?: any
  loading?: boolean
  error?: string
  message?: string
}

const initialState: IMutationState = {
  loading: false,
  data: undefined,
  error: undefined,
  message: undefined,
}

const useMutation = (url: string) => {
  const [{data, loading, error}, dispatch] = useReducer(
    (prev: IMutationState, next: IMutationState) => ({...prev, ...next}),
    initialState
  )

  const post = async (
    payload: any,
    onCompleted?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      dispatch({loading: true})
      const {data} = await http.post(url, payload)
      dispatch({data: data?.data, message: data.message})
      onCompleted && onCompleted()
    } catch (error: any) {
      const err = error?.message
      // let err = ((error as AxiosError)?.response?.data as IAxiosError)?.message;
      dispatch({error: err})
      onError && onError(err)
    } finally {
      dispatch({loading: false})
    }
  }

  const patch = async (
    _id: string,
    _payload: any,
    onCompleted?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      dispatch({loading: true})
      // const {data} = await http.patch(`${url}/${id}`, payload)
      dispatch({data: data.data, message: data.message})
      onCompleted && onCompleted()
    } catch (error: any) {
      const err = error?.message
      // let err = ((error as AxiosError)?.response?.data as IAxiosError)?.message;
      dispatch({error: err})
      onError && onError(err)
    } finally {
      dispatch({loading: false})
    }
  }

  const put = async (
    id: string,
    payload: any,
    onCompleted?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      dispatch({loading: true})
      const {data} = await http.put(`${url}/${id}`, payload)
      dispatch({data: data.data, message: data.message})
      onCompleted && onCompleted()
    } catch (error: any) {
      const err = error?.message
      // let err = ((error as AxiosError)?.response?.data as IAxiosError)?.message;
      dispatch({error: err})
      onError && onError(err)
    } finally {
      dispatch({loading: false})
    }
  }

  const remove = async (
    _id: string,
    onCompleted?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      dispatch({loading: true})
      // const {data} = await http.delete(`${url}/${id}`)
      dispatch({data: data.data, message: data.message})
      onCompleted && onCompleted()
    } catch (error: any) {
      const err = error?.message
      // let err = ((error as AxiosError)?.response?.data as IAxiosError)?.message;
      dispatch({error: err})
      onError && onError(err)
    } finally {
      dispatch({loading: false})
    }
  }

  return {data, loading, error, post, patch, put, remove}
}

export default useMutation
