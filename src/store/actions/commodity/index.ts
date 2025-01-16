/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {ICommodity} from "../../../interfaces/commodity"
import {initialize, failed, success, reset} from "../../slices/commodity"
import {toast} from "react-toastify"

export const createCommodityAction =
  (commodity: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!commodity.has("name")) {
      dispatch(failed("Please enter commodity name"))
      return toast.error("Please enter commodity name")
    }
    if (!commodity.has("price")) {
      dispatch(failed("Please enter commodity price"))
      return toast.error("Please enter commodity price")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(commodity)

    const price = formData.price

    try {
      const respone = await http.post("/commodity", {
        ...formData,
        price: JSON.parse(price as string),
      })
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (respone.data.data?.error) {
        dispatch(failed(respone.data.data.message))
        return toast.error(respone.data.data.message)
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

export const updateCommodityAction =
  (commodity: ICommodity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!commodity._id) {
      dispatch(failed("Wrong commodity selection"))
      return toast.error("Wrong commodity selection")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/commodity/${commodity._id}`, {
        ...commodity,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/")
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
    }
  }

export const deleteCommodityAction =
  (commodity: ICommodity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!commodity._id) {
      dispatch(failed("Wrong disbursement selection"))
      return dispatch(reset())
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/commodity/${commodity._id}`)

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

export const deleteWHCommodityAction =
  (commodity: {id: string; commodity_id?: string}, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!commodity.id || !commodity.commodity_id) {
      dispatch(failed("Wrong disbursement selection"))
      return dispatch(reset())
    }

    dispatch(initialize())

    try {
      const response = await http.delete(
        `/commodity/warehouse/${commodity.id}?commodity_id=${commodity.commodity_id}`
      )

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
