/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IGrade} from "../../../interfaces/grade"
import {initialize, failed, success} from "../../slices/grade"
import {toast} from "react-toastify"

export const createGradeAction =
  (grade: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!grade.has("name")) {
      dispatch(failed("Please enter grade name"))
      return toast.error("Please enter grade name")
    }
    if (!grade.has("percentage")) {
      dispatch(failed("Please enter grade percentage"))
      return toast.error("Please enter grade percentage")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(grade)

    try {
      const respone = await http.post("/grade", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        toast.warn("Session expired, Plaese Login")
        window.location.replace("/auth")
        return
      }
      if (respone.data?.error) {
        dispatch(failed(respone.data.message))
        return toast.error(respone.data.message)
      }
      dispatch(success(respone.data.data))
      toast.success(respone.data.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError).response?.data as IAxiosError).message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError).response?.data as IAxiosError).message ??
          (err as any)?.message
      )
    }
  }

export const updateGradeAction =
  (grade: IGrade, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (!grade._id) {
      dispatch(failed("Wrong grade selection"))
      return toast.error("Wrong grade selection")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/grade/${grade._id}`, {
        ...grade,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        toast.warn("Session expired, Plaese Login")
        window.location.replace("/auth")
        return
      }
      if (response.data?.error) {
        dispatch(failed(response.data.message))
        return toast.error(response.data.message)
      }
      dispatch(success(response.data.data))
      toast.success(response.data.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError).response?.data as IAxiosError).message ??
            (err as any)?.message
        )
      )
      toast.success(
        ((err as AxiosError).response?.data as IAxiosError).message ??
          (err as any)?.message
      )
    }
  }
