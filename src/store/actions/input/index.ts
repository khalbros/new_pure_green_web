/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import { IInput } from "../../../interfaces/input"
import { initialize, failed, success, reset } from "../../slices/input"
import { toast } from "react-toastify"

export const createInputAction = (
  input: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input.has("name")) {
    toast.error("Please enter input name")
    dispatch(failed("Please enter input name"))
    return
  }

  dispatch(initialize())

  const formData = Object.fromEntries(input)

  try {
    const respone = await http.post("/input", formData)
    if (!respone.data) {
      dispatch(failed(respone.statusText ?? respone))
      return toast.error(respone.statusText ?? respone)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login/login")
      return
    }
    if (respone.data.data?.error) {
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

export const addWarehouseInputAction = (
  input: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input.has("input")) {
    toast.error("Please select input")
    dispatch(failed("Please select input"))
    return
  }

  dispatch(initialize())

  const formData = Object.fromEntries(input)

  try {
    const respone = await http.post("/input/warehouse", formData)
    if (!respone.data) {
      dispatch(failed(respone.statusText ?? respone))
      return toast.error(respone.statusText ?? respone)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login/login")
      return
    }
    if (respone.data.data?.error) {
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

export const updateWarehouseInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong input selection"))
    return toast.error("Wrong input selection")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/input/warehouse/${input._id}`, {
      ...input,
    })
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login")
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

export const updateInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong input selection"))
    return toast.error("Wrong input selection")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/input/${input._id}`, {
      ...input,
    })
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login")
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

export const approveInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong input selection"))
    return toast.error("Wrong input selection")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/input/approve/${input._id}`, {
      isApproved: input.isApproved,
    })
    console.log("dispatch called")
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login")
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
export const approveWarehouseInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong input selection"))
    return toast.error("Wrong input selection")
  }

  dispatch(initialize())

  try {
    const response = await http.patch(`/input/warehouse/approve/${input._id}`, {
      isApproved: input.isApproved,
    })
    console.log("dispatch called")
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("Session expired, Plaese Login")
      window.location.replace("/auth/login")
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

export const deleteInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong disbursement selection"))
    return dispatch(reset())
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/input/${input._id}`)

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
    toast.success(response.data.message)
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
export const deleteWarehouseInputAction = (
  input: IInput,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!input._id) {
    dispatch(failed("Wrong disbursement selection"))
    return dispatch(reset())
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/input/warehouse/${input._id}`)

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
    toast.success(response.data.message)
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
