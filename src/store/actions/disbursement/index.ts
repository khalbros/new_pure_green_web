/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IDisbursement} from "../../../interfaces/disbursement"
import {initialize, failed, success, reset} from "../../slices/disbursement"
import {toast} from "react-toastify"
import {ICashFormdata} from "../../../interfaces/cashLRP"
import {IGrainFormData, IGrainLRPPayload} from "../../../interfaces/grainLRP"

export const loanDisbursementAction =
  (disbursement: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement.has("farmer")) {
      dispatch(failed("Please enter farmer id"))
      return toast.error("Please enter farmer name or ID")
    }
    if (!disbursement.has("bundle")) {
      dispatch(failed("Please select bundle"))
      return toast.error("Please select bundle")
    }
    if (!disbursement.has("hectares")) {
      dispatch(failed("Please enter hectares"))
      return toast.error("Please enter hectares")
    }
    if (!disbursement.has("equity")) {
      dispatch(failed("Please enter equity"))
      return toast.error("Please enter equity")
    }
    if (!disbursement.has("loan_amount")) {
      dispatch(failed("Please enter loan amount"))
      return toast.error("Please enter loan amount")
    }
    if (!disbursement.has("repayment_amount")) {
      dispatch(failed("Please enter repayment amount"))
      return toast.error("Please enter repayment amount")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(disbursement)

    try {
      const respone = await http.post("/disbursement/loan", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        window.location.replace("/")
        return toast.error("pleace login")
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const repaymentDisbursementAction =
  (disbursement: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    const formData = Object.fromEntries(disbursement)

    if (!disbursement.has("farmer")) {
      dispatch(failed("Please enter disbursement farmer"))
      return toast.error("Please enter disbursement farmer")
    }
    if (
      !disbursement.has("commodities") &&
      formData.repayment_type === "Grains"
    ) {
      dispatch(failed("Please enter commodity"))
      return toast.error("Please enter commodity")
    }
    if (
      !disbursement.has("gross_weight") &&
      formData.repayment_type === "Grains"
    ) {
      dispatch(failed("Please enter gross weight"))
      return toast.error("Please enter gross weight")
    }
    if (!disbursement.has("num_bags") && formData.repayment_type === "Grains") {
      dispatch(failed("Please enter number of bags"))
      return toast.error("Please enter number of bags")
    }
    if (!disbursement.has("payable_amount")) {
      dispatch(failed("Please enter payable amount"))
      return toast.error("Please enter payable amount")
    }
    if (!disbursement.has("overage")) {
      dispatch(failed("Please enter overage"))
      return toast.error("Please enter overage")
    }
    if (!disbursement.has("outstanding_loan")) {
      dispatch(failed("Please enter outstanding loan"))
      return toast.error("Please enter outstanding loan")
    }

    dispatch(initialize())

    const commodities = formData.commodities
    try {
      const respone = await http.post("/disbursement/repayment/grain", {
        ...formData,
        commodities: commodities && JSON.parse(commodities as string),
      })
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText)
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
      toast.success(respone.data.message)
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const approveDisbursementAction =
  (disbursement: IDisbursement, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      toast.error("Wrong disbursement selection;")
      return callback()
    }

    dispatch(initialize())

    try {
      const response = await http.patch(
        `/disbursement/approve/${disbursement._id}`,
        {
          ...disbursement,
        }
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.statusText)
        return callback()
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        toast.error(response.data.message)
        return callback()
      }
      if (response.data?.error) {
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
      return callback()
    }
  }

export const updateDisbursementAction =
  (disbursement: IDisbursement, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/disbursement/${disbursement._id}`, {
        ...disbursement,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.data.message)
        return callback()
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        window.location.reload()
        toast.error(response.data.message)
        return callback()
      }
      if (response.data.error) {
        dispatch(failed(response.data.message))
        toast.error(response.data.message)
        return callback()
      }
      dispatch(success(response.data.data))
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
      return callback()
    }
  }

export const deleteDisbursementAction =
  (disbursement: IDisbursement, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection"))
      dispatch(reset())
      toast.error("Select disbursement to delete")
      return callback()
    }

    dispatch(initialize())

    try {
      const response = await http.delete(`/disbursement/${disbursement._id}`)

      if (response.status === 401) {
        deleteToken()
        deleteUser()
        window.location.replace("/")
        toast.error(response.status)
        dispatch(reset())
        return callback()
      }
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.status)
        dispatch(reset())
        return callback()
      }
      if (response.data?.error) {
        dispatch(failed(response.data.message))
        toast.error(response.data.message)
        dispatch(reset())
        return callback()
      }

      dispatch(success(response.data.data))
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error((err as any)?.message)
      dispatch(reset())
    }
  }

//Cash LRP actions

export const cashLRPAction =
  (disbursement: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    const formData = Object.fromEntries(disbursement)

    if (!disbursement.has("cash_paid")) {
      dispatch(failed("Please enter disbursement farmer"))
      return toast.error("Please enter disbursement farmer")
    }

    if (!disbursement.has("payable_amount")) {
      dispatch(failed("Please enter payable amount"))
      return toast.error("Please enter payable amount")
    }
    if (!disbursement.has("overage")) {
      dispatch(failed("Please enter overage"))
      return toast.error("Please enter overage")
    }
    if (!disbursement.has("outstanding_loan")) {
      dispatch(failed("Please enter outstanding loan"))
      return toast.error("Please enter outstanding loan")
    }

    dispatch(initialize())

    try {
      const respone = await http.post("/disbursement/repayment/cash", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText)
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const updateCashLRPAction =
  (disbursement: ICashFormdata, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(
        `/disbursement/cash/${disbursement._id}`,
        {
          ...disbursement,
        }
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.reload()
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
    }
  }

export const deleteCashLRPAction =
  (disbursement: ICashFormdata, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.delete(
        `/disbursement/cash/${disbursement._id}`
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.statusText)
        return callback()
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.reload()
      }
      if (response.data?.error) {
        dispatch(failed(response.data.message))
        toast.error(response.data.message)
        return callback()
      }
      dispatch(success(response.data.data))
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
    }
  }

//Grain LRP actions

export const grianLRPAction =
  (disbursement: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    const formData = Object.fromEntries(disbursement)

    if (!disbursement.has("cash_paid")) {
      dispatch(failed("Please enter disbursement farmer"))
      return toast.error("Please enter disbursement farmer")
    }

    if (!disbursement.has("payable_amount")) {
      dispatch(failed("Please enter payable amount"))
      return toast.error("Please enter payable amount")
    }
    if (!disbursement.has("overage")) {
      dispatch(failed("Please enter overage"))
      return toast.error("Please enter overage")
    }
    if (!disbursement.has("outstanding_loan")) {
      dispatch(failed("Please enter outstanding loan"))
      return toast.error("Please enter outstanding loan")
    }

    dispatch(initialize())

    try {
      const respone = await http.post("/disbursement/repayment/cash", formData)
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText)
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
      toast.error(
        ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
          (err as any)?.message
      )
    }
  }

export const updateGrainLRPAction =
  (disbursement: IGrainFormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.patch(
        `/disbursement/cash/${disbursement._id}`,
        {
          ...disbursement,
        }
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        return
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.reload()
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
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
    }
  }

export const deleteGrainLRPAction =
  (disbursement: IGrainLRPPayload, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!disbursement._id) {
      dispatch(failed("Wrong disbursement selection;"))
      return
    }

    dispatch(initialize())

    try {
      const response = await http.delete(
        `/disbursement/cash/${disbursement._id}`
      )
      if (!response.data) {
        dispatch(failed(response.statusText))
        toast.error(response.statusText)
        return callback()
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return window.location.reload()
      }
      if (response.data?.error) {
        dispatch(failed(response.data.message))
        toast.error(response.data.message)
        return callback()
      }
      dispatch(success(response.data.data))
      callback()
    } catch (err) {
      dispatch(
        failed(
          ((err as AxiosError)?.response?.data as IAxiosError)?.message ??
            (err as any)?.message
        )
      )
    }
  }
