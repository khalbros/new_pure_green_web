/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import { ICooperative } from "../../../interfaces/cooperative"
import { initialize, failed, success, reset } from "../../slices/cooperative"
import { toast } from "react-toastify"

export const createCooperativeAction = (
  cooperative: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!cooperative.has("name")) {
    dispatch(failed("Please enter cooperative name"))
    return toast.error("Please enter cooperative name")
  }
  if (!cooperative.has("chairman")) {
    dispatch(failed("Please enter cooperative chairman name"))
    return toast.error("Please enter cooperative chairman name")
  }
  if (!cooperative.has("phone")) {
    dispatch(failed("Please enter cooperative phone number"))
    return toast.error("Please enter cooperative phone number")
  }
  if (!cooperative.has("village")) {
    dispatch(failed("Please enter cooperative village"))
    return toast.error("Please enter cooperative village")
  }
  if (!cooperative.has("village_head")) {
    dispatch(failed("Please enter cooperative village head name"))
    return toast.error("Please enter cooperative village head name")
  }

  dispatch(initialize())

  const formData = Object.fromEntries(cooperative)

  try {
    const respone = await http.post("/cooperative", formData)
    if (!respone.data) {
      dispatch(failed(respone.statusText ?? respone))
      return toast.error(respone.statusText ?? respone)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      dispatch(failed(respone.data.message))
      return toast.error(respone.data.message)
    }
    if (respone.data?.error) {
      dispatch(failed(respone.data.message))
      return toast.error(respone.data.message)
    }
    dispatch(success(respone.data))
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

export const updateCooperativeAction = (
  cooperative: ICooperative,
  callback: () => void
) => async (dispatch: Dispatch<unknown>) => {
  if (!cooperative._id) {
    dispatch(failed("Wrong cooperative selection"))
    return toast.error("Wrong cooperative selection")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/cooperative/${cooperative._id}`, {
      ...cooperative,
    })
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("session expired please login")
      window.location.replace("/auth")
      return
    }
    if (response.data.data?.failed) {
      dispatch(failed(response.data.data.message))
      return toast.error(response.data.data.message)
    }
    dispatch(success(response.data.data))
    toast.success(response.data.data.message)
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

export const deleteCooperativeAction = (
  cooperative: ICooperative,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!cooperative._id) {
    dispatch(failed("Wrong cooperative selection"))
    return dispatch(reset())
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/cooperative/${cooperative._id}`)

    if (response.status === 401) {
      deleteToken()
      deleteUser()
      window.location.replace("/")
      toast.error(response.status)
      return dispatch(reset())
    }
    if (!response.data) {
      dispatch(failed(response.statusText))
      toast.error(response.status)
      return dispatch(reset())
    }
    if (response.data.data?.error) {
      dispatch(failed(response.data.data.message))
      toast.error(response.data.data.message)
      return dispatch(reset())
    }

    dispatch(success(response.data.data))
    callback()
  } catch (err) {
    dispatch(
      failed(
        ((err as AxiosError).response?.data as IAxiosError).message ??
          (err as any)?.message
      )
    )
    toast.error((err as any).message)
    dispatch(reset())
  }
}
