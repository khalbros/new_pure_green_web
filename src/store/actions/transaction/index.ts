/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {ITransaction} from "../../../interfaces/transaction"
import {initialize, failed, success, reset} from "../../slices/transaction"
import {toast} from "react-toastify"

export const createTransactionAction =
  (transaction: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!transaction.has("type")) {
      dispatch(failed("Please enter transaction type"))
      return toast.error("Please enter transaction type")
    }
    if (!transaction.has("client")) {
      dispatch(failed("Please enter client"))
      return toast.error("Please enter client")
    }
    if (!transaction.has("commodity")) {
      dispatch(failed("Please enter transaction commodity"))
      return toast.error("Please enter transaction commodity")
    }
    if (!transaction.has("gross_weight")) {
      dispatch(failed("Please enter transaction weight"))
      return toast.error("Please enter transaction weight")
    }
    if (!transaction.has("num_bags")) {
      dispatch(failed("Please enter transaction number of bags"))
      return toast.error("Please enter transaction number of bags")
    }
    if (!transaction.has("truck_number")) {
      dispatch(failed("Please enter truck number"))
      return toast.error("Please enter truck number")
    }
    if (!transaction.has("driver")) {
      dispatch(failed("Please enter driver name"))
      return toast.error("Please enter driver name")
    }
    if (!transaction.has("amount")) {
      dispatch(failed("Please enter payable amount"))
      return toast.error("Please enter payable amount")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(transaction)

    try {
      const respone = await http.post("/transaction", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (respone.data?.error) {
        dispatch(failed(respone.data.data?.message))
        return toast.error(respone.data.data?.message)
      }
      dispatch(success(respone.data.data?.data))
      toast.success(respone.data.data?.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError).response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError).response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const updateTransactionAction =
  (transaction: ITransaction, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    console.log(transaction)

    if (!transaction._id) {
      dispatch(failed("Wrong transaction selection;"))
      return toast.error("Wrong transaction selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/transaction/${transaction._id}`, {
        ...transaction,
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
      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
        return toast.error(response.data.data.message)
      }
      dispatch(success(response.data.data.data))
      toast.success(response.data.data.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError).response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError).response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const approveTransactionAction =
  (transaction: ITransaction, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!transaction._id) {
      dispatch(failed("Wrong transaction selection;"))
      return toast.error("Wrong transaction selection;")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(
        `/transaction/approve/${transaction._id}`,
        {
          ...transaction,
        }
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.replace("/")
      }
      if (response.data.data?.error) {
        dispatch(failed(response.data.data?.message))
        return toast.error(response.data.data?.message)
      }
      dispatch(success(response.data.data?.data))
      toast.success(response.data.data?.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError).response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError).response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const deleteTransactionAction =
  (transaction: ITransaction, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!transaction._id) {
      dispatch(failed("Wrong transaction id"))
      return dispatch(reset())
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/transaction/${transaction._id}`)

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
