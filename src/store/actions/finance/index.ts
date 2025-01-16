/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {initialize, failed, success} from "../../slices/finance/overage"
import {toast} from "react-toastify"
import {IOverage} from "../../../interfaces/overage"
import {IPayment} from "../../../interfaces/payment"
import {IEquity} from "../../../interfaces/equity"

export const createOverageAction =
  (overage: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!overage.has("farmer_id")) {
      dispatch(failed("Please enter farmer id"))
      return toast.error("Please enter farmer name or ID")
    }

    if (!overage.has("account")) {
      dispatch(failed("Please enter farmer account number"))
      return toast.error("Please enter farmer aount number")
    }
    if (!overage.has("bank")) {
      dispatch(failed("Please enter bank name"))
      return toast.error("Please enter bank name")
    }
    if (!overage.has("overage")) {
      dispatch(failed("Please enter overage amount"))
      return toast.error("Please enter overage amount")
    }
    if (!overage.has("amount")) {
      dispatch(failed("Please enter payment amount"))
      return toast.error("Please enter payment amount")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(overage)

    try {
      const respone = await http.post("/overage", formData)
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
        dispatch(failed(respone.data.message))
        return toast.error(respone.data.message)
      }
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

export const updateOverageAction =
  (overage: IOverage, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!overage._id) {
      dispatch(failed("Wrong overage id"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/overage/${overage._id}`, {
        ...overage,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (response.data.data?.failed) {
        dispatch(failed(response.data.data.message))
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
    }
  }

export const createPaymentAction =
  (payment: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment.has("client_id")) {
      dispatch(failed("Please enter client id"))
      return
    }
    if (!payment.has("amount")) {
      dispatch(failed("Please enter payable amount"))
      return
    }

    dispatch(initialize())

    const formData = Object.fromEntries(payment)

    try {
      const respone = await http.post("/payment", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (respone.data.data?.error) {
        dispatch(failed(respone.data.data.message))
        return
      }
      dispatch(success(respone.data.data))
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

export const updatePaymentAction =
  (payment: IPayment, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment._id) {
      dispatch(failed("Wrong payment id"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/payment/${payment._id}`, {
        ...payment,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (response.data.data?.failed) {
        dispatch(failed(response.data.data.message))
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
    }
  }

// equity
export const equityPaymentAction =
  (payment: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment.has("farmer")) {
      dispatch(failed("Please enter farmer id"))
      return
    }
    if (!payment.has("amount_paid")) {
      dispatch(failed("Please enter amount"))
      return
    }

    dispatch(initialize())

    const formData = Object.fromEntries(payment)

    try {
      const respone = await http.post("/payment/equity", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (respone.data.data?.error) {
        dispatch(failed(respone.data.data.message))
        return
      }
      dispatch(success(respone.data.data))
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

export const updateEquityPaymentAction =
  (payment: IEquity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment._id) {
      dispatch(failed("Wrong payment id"))
      return toast.error("Wrong payment id")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/payment/equity/${payment._id}`, {
        ...payment,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return toast.error(response.statusText)
      }
      if (response.data.error) {
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
    }
  }

export const deleteEquityPaymentAction =
  (payment: IEquity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment._id) {
      dispatch(failed("Wrong payment id"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/payment/equity/${payment._id}`)
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
      }

      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
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
    }
  }

// registration
export const registrationPaymentAction =
  (payment: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment.has("farmer")) {
      dispatch(failed("Please enter farmer id"))
      return
    }
    if (!payment.has("amount_paid")) {
      dispatch(failed("Please enter amount"))
      return
    }

    dispatch(initialize())

    const formData = Object.fromEntries(payment)

    try {
      const respone = await http.post("/payment/registration", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return
      }
      if (respone.data.data?.error) {
        dispatch(failed(respone.data.data.message))
        return
      }
      dispatch(success(respone.data.data))
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

export const updateRegistrationPaymentAction =
  (payment: IEquity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment._id) {
      dispatch(failed("Wrong payment id"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(
        `/payment/registration/${payment._id}`,
        {
          ...payment,
        }
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
      }

      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
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
    }
  }

export const deleteRegistrationPaymentAction =
  (payment: IEquity, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!payment._id) {
      dispatch(failed("Wrong payment id"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/payment/registration/${payment._id}`)
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
      }

      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
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
    }
  }
