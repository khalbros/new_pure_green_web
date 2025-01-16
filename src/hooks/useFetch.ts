/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios"
import { useCallback, useEffect, useReducer } from "react"
import { deleteToken, deleteUser, http } from "../utils"
import IAxiosError from "../interfaces/axios.error"
import { toast } from "react-toastify"

interface IFetchState {
  data?: any
  loading: boolean
  error: boolean
  message?: string
}

const initialState: IFetchState = {
  data: undefined,
  loading: true,
  error: false,
  message: undefined,
}

const useFetch = (url: string) => {
  const [{ data, loading, error, message }, dispatch] = useReducer(
    (prev: IFetchState, next: IFetchState) => ({ ...prev, ...next }),
    initialState
  )

  const fetchData = useCallback(async () => {
    try {
      const { data } = await http.get(url)
      if (data.data.error) {
        dispatch({
          loading: false,
          error: true,
          message: data.data?.message,
        })
      }
      dispatch({ loading: false, error: false, data: data.data })
    } catch (error) {
      if ((error as any).status === 401) {
        deleteToken()
        deleteUser()
        toast.warn("Sorry your session exired, Please Login again")
        window.location.replace("/auth")
      }
      dispatch({
        loading: false,
        error: true,
        message: ((error as AxiosError)?.response?.data as IAxiosError)
          ?.message,
      })
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData, url])

  return { data, loading, error, message, refetch: fetchData }
}

export default useFetch
