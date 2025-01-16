/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import { IWarehouse } from "../../../interfaces/warehouse"
import { initialize, failed, success } from "../../slices/warehouse"
import { toast } from "react-toastify"

export const createWarehouseAction = (
  warehouse: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!warehouse.has("name")) {
    dispatch(failed("Please enter warehouse name"))
    toast.error("Please enter warehouse name")
    return
  }
  if (!warehouse.has("capacity")) {
    dispatch(failed("Please enter warehouse capacity"))
    return toast.error("Please enter warehouse capacity")
  }
  if (!warehouse.has("state")) {
    dispatch(failed("Please enter warehouse state"))
    return toast.error("Please enter warehouse state")
  }
  if (!warehouse.has("lga")) {
    dispatch(failed("Please enter warehouse local govt."))
    return toast.error("Please enter warehouse local govt.")
  }
  if (!warehouse.has("address")) {
    dispatch(failed("Please enter warehouse local govt."))
    return toast.error("Please enter warehouse local govt.")
  }

  dispatch(initialize())

  const formData = Object.fromEntries(warehouse)

  try {
    const respone = await http.post("/warehouse", formData)
    if (!respone.data) {
      dispatch(failed(respone.statusText ?? respone))
      return toast.error(respone.statusText ?? respone)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Please Login")
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

export const updateWarehouseAction = (
  warehouse: IWarehouse,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!warehouse._id) {
    dispatch(failed("Wrong warehouse selection;"))
    return toast.error("Wrong warehouse selection;")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/warehouse/${warehouse._id}`, {
      ...warehouse,
    })
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Please Login")
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
    toast.error(
      ((err as AxiosError).response?.data as IAxiosError).message ??
        (err as any)?.message
    )
  }
}

export const deleteWarehouseAction = (
  warehouse: IWarehouse,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!warehouse._id) {
    dispatch(failed("Wrong warehouse selection;"))
    return toast.error("Wrong warehouse selection;")
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/warehouse/${warehouse._id}`)

    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Please Login")
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
    toast.error(
      ((err as AxiosError).response?.data as IAxiosError).message ??
        (err as any)?.message
    )
  }
}
