/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IDispatch} from "../../../interfaces/dispatch"
import {initialize, failed, success} from "../../slices/dispatch"
import {toast} from "react-toastify"

export const createDispatchAction =
  (dispatches: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches.has("type")) {
      dispatch(failed("Please enter dispatch name"))
      return toast.error("Please enter dispatch name")
    }
    if (!dispatches.has("client") && !dispatches.has("warehouse")) {
      dispatch(failed("Please enter client / warehouse name"))
      return toast.error("Please enter client / warehouse name")
    }
    if (!dispatches.has("item")) {
      dispatch(failed("Please enter dispatch item"))
      return toast.error("Please enter dispatch item")
    }
    if (!dispatches.has("item_type")) {
      dispatch(failed("Please enter dispatch item_type"))
      return toast.error("Please enter dispatch item_type")
    }
    if (!dispatches.has("num_bags")) {
      dispatch(failed("Please enter dispatch number of bags"))
      return toast.error("Please enter dispatch number of bags")
    }
    if (!dispatches.has("driver")) {
      dispatch(failed("Please enter driver's name"))
      return toast.error("Please enter driver's name")
    }
    if (!dispatches.has("truck_num")) {
      dispatch(failed("Please enter truck number"))
      return toast.error("Please enter truck number")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(dispatches)

    try {
      const respone = await http.post("/dispatch", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/auth/login")
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

export const updateDispatchAction =
  (dispatches: IDispatch, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches._id) {
      dispatch(failed("Wrong dispatch selection;"))
      return toast.error("Wrong dispatch selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/dispatch/${dispatches._id}`, {
        ...dispatches,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/auth/login")
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

export const approveDispatchAction =
  (dispatches: IDispatch, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches._id) {
      dispatch(failed("Wrong dispatch selection;"))
      return toast.error("Wrong dispatch selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/dispatch/approve/${dispatches._id}`, {
        isApproved: dispatches.isApproved,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/auth/login")
      }
      if (response.data.data?.failed) {
        dispatch(failed(response.data.data.message))
        return toast.error(response.data.data.message)
      }
      dispatch(success(response.data.data))
      toast.success(response.data.data)
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

export const verifyDispatchAction =
  (dispatches: {otp: string; id: string}, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches.id) {
      dispatch(failed("Wrong dispatch selection;"))
      return toast.error("Wrong dispatch selection")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/dispatch/verify/${dispatches.id}`, {
        otp: dispatches.otp,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/auth/login")
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

export const acceptDispatchAction =
  (dispatches: IDispatch, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches._id) {
      dispatch(failed("Wrong dispatch selection;"))
      return toast.error("Wrong dispatch selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/dispatch/confirm/${dispatches._id}`, {
        isReceived: dispatches.isReceived,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.statusText)
        return callback()
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        toast.error(response.data.message)
        callback()
        return window.location.replace("/auth/login")
      }
      if (response.data?.failed) {
        dispatch(failed(response.data.message))
        toast.error(response.data.message)
        return callback()
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

export const deleteDispatchAction =
  (dispatches: IDispatch, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!dispatches._id) {
      dispatch(failed("Wrong dispatch selection;"))
      return toast.error("Wrong dispatch selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/dispatch/${dispatches._id}`)
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        window.location.replace("/")
        return toast.error("pleace login")
      }
      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
        return toast.error(response.data.data.message)
      }
      dispatch(success(response.data.data))
      callback()
      toast.success(response.data.message)
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
