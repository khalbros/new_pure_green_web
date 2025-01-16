/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from "axios"
import { Dispatch } from "react"
import { AsyncDeleteItem, AsyncSaveItem, http } from "../../utils"

import IAxiosError from "../../interfaces/axios.error"

import { toast } from "react-toastify"
import { failed, initialize, reset, success } from "../slices/farmer_auth.slice"

export const farmerLoginAction = (
  farmerId: string,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  reset()
  if (farmerId === "" || farmerId === undefined) {
    dispatch(failed("please enter your ID number"))
    return toast.error("Please enter your ID number")
  }
  dispatch(initialize())

  try {
    const response = await http.post("/auth/farmer/login", {
      farmerID: farmerId,
    })

    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }

    if (response.data.error) {
      dispatch(failed(response.data.message))
      return toast.error(response.data.message)
    }

    await AsyncSaveItem("farmerID", farmerId)

    dispatch(success({ farmer: response.data.data }))
    toast.success(response.data.message)
    callback()
    return
  } catch (error) {
    dispatch(
      failed(
        ((error as AxiosError).response?.data as IAxiosError)?.message ??
          (error as any)?.message
      )
    )
  }
}

export const farmerLogoutAction = (callback: () => void) => async (
  dispatch: Dispatch<any>
) => {
  dispatch(initialize())
  try {
    await AsyncDeleteItem("farmer")
    await AsyncDeleteItem("farmerID")
    callback()
  } catch (error) {
    dispatch(
      failed(
        ((error as AxiosError).response?.data as IAxiosError)?.message ??
          (error as any)?.message
      )
    )
  }
}

export const farmerVerifyOTP = (otp: string, callback: () => void) => async (
  dispatch: Dispatch<any>
) => {
  if (otp === "" || otp === undefined) {
    dispatch(failed("please enter the OTP send to you"))
    return toast.error("please enter th OTP send to you")
  }

  dispatch(initialize())

  try {
    const response = await http.post("/auth/farmer/verify-otp", { otp })
    if (!response.data) {
      dispatch(failed(response.statusText))
      return toast.error(response.statusText)
    }
    if (response.data.error) {
      dispatch(failed(response.data.message))
      return toast.error(response.data.message)
    }
    console.log(response)

    await AsyncSaveItem("farmer", response.data.data)
    toast.success(response.data.message)
    callback()
    return
  } catch (error) {
    dispatch(
      failed(
        ((error as AxiosError).response?.data as IAxiosError)?.message ??
          (error as any)?.message
      )
    )
    return toast.error(
      ((error as AxiosError).response?.data as IAxiosError)?.message ??
        (error as any)?.message
    )
  }
}
