/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import { IClient } from "../../../interfaces/client"
import { initialize, failed, success } from "../../slices/client"
import { toast } from "react-toastify"

export const createClientAction = (
  client: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!client.has("name")) {
    toast.error("Please enter client name")
    dispatch(failed("Please enter client name"))
    return
  }
  if (!client.has("email")) {
    toast.error("Please enter client email")
    dispatch(failed("Please enter client email"))
    return
  }
  if (!client.has("phone")) {
    toast.error("Please enter client phone number")
    dispatch(failed("Please enter client phone number"))
    return
  }
  if (!client.has("address")) {
    toast.error("Please enter client address")
    dispatch(failed("Please enter client address"))
    return
  }
  if (!client.has("account_number")) {
    toast.error("Please enter client account")
    dispatch(failed("Please enter client account"))
    return
  }
  if (!client.has("bank_name")) {
    toast.error("Please enter client bank name")
    dispatch(failed("Please enter client bank name"))
    return
  }

  dispatch(initialize())

  const formData = Object.fromEntries(client)

  try {
    const respone = await http.post("/client", formData)
    if (!respone.data) {
      toast.error(respone.statusText ?? respone)
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
      toast.error(respone.data.message)
      dispatch(failed(respone.data.message))
      return
    }
    toast.success(respone.data.message)
    dispatch(success(respone.data.data))
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

export const updateClientAction = (
  client: IClient,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!client._id) {
    toast.error("Wrong client selection")
    dispatch(failed("Wrong client selection"))
    return
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/client/${client._id}`, {
      ...client,
    })

    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth")
      return
    }
    if (!response.data) {
      toast.error(response.statusText)
      dispatch(failed(response.statusText))
      return
    }
    if (response.data?.error) {
      toast.error(response.data.message)
      dispatch(failed(response.data.message))
      return
    }
    toast.success(response.data.message)
    dispatch(success(response.data.data))
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

export const deleteClientAction = (
  client: IClient,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!client._id) {
    dispatch(failed("Wrong client selection"))
    return
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/client/${client._id}`)

    if (response.status === 401) {
      deleteToken()
      deleteUser()
      window.location.replace("/")
      toast.error(response.status)
      return
    }
    if (!response.data) {
      dispatch(failed(response.statusText))
      toast.error(response.status)
      return
    }
    if (response.data.data?.error) {
      dispatch(failed(response.data.data.message))
      toast.error(response.data.data.message)
      return
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
  }
}
