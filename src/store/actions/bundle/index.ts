/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IBundle} from "../../../interfaces/bundle"
import {initialize, failed, success, reset} from "../../slices/bundle"
import {toast} from "react-toastify"

export const createBundleAction =
  (bundle: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!bundle.has("name")) {
      dispatch(failed("Please enter bundle name"))
      return toast.error("Please enter bundle name")
    }
    if (!bundle.has("total")) {
      dispatch(failed("Please enter bundle loan total"))
      return
    }
    if (!bundle.has("inputs")) {
      dispatch(failed("Please enter bundle inputs"))
      return toast.error("Please enter bundle inputs")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(bundle)
    const inputs = formData.inputs
    try {
      const respone = await http.post("/bundle", {
        ...formData,
        inputs: JSON.parse(inputs as string),
      })
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
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

export const updateBundleAction =
  (bundle: IBundle, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!bundle._id) {
      dispatch(failed("Wrong bundle selection;"))
      return toast.error("Wrong bundle selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/bundle/${bundle._id}`, {
        ...bundle,
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
      if (response.data.data?.failed) {
        dispatch(failed(response.data.message))
        return toast.error(response.data.message)
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
      toast.error(
        ((err as AxiosError).response?.data as IAxiosError).message ??
          (err as any)?.message
      )
    }
  }

export const deleteBundleAction =
  (bundle: IBundle, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!bundle._id) {
      dispatch(failed("Wrong disbursement selection"))
      return dispatch(reset())
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/bundle/${bundle._id}`)

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
