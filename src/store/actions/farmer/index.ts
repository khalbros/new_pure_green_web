/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import { IFarmer } from "../../../interfaces/farmer"
import { initialize, failed, success, reset } from "../../slices/farmer"
import { toast } from "react-toastify"

export const createFarmerAction = (
  farmer: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!farmer.has("first_name")) {
    dispatch(failed("Please enter farmer first name"))
    toast.error("Please enter farmer name")
    return dispatch(reset())
  }
  if (!farmer.has("last_name")) {
    dispatch(failed("Please enter farmer last name"))
    toast.error("Please enter farmer name")
    return dispatch(reset())
  }
  if (!farmer.has("gender")) {
    dispatch(failed("Please enter farmer gender"))
    toast.error("Please enter farmer gender")
    return dispatch(reset())
  }
  if (!farmer.has("phone")) {
    dispatch(failed("Please enter farmer phone number"))
    toast.error("Please enter farmer phone number")
    return dispatch(reset())
  }
  if (!farmer.has("date_of_birth")) {
    dispatch(failed("Please enter farmer date of birth"))
    toast.error("Please enter farmer date of birth")
    return dispatch(reset())
  }
  if (!farmer.has("address")) {
    dispatch(failed("Please enter farmer address"))
    toast.error("Please enter farmer address")
    return dispatch(reset())
  }
  if (!farmer.has("state")) {
    dispatch(failed("Please enter farmer state"))
    toast.error("Please enter farmer state")
    return dispatch(reset())
  }
  if (!farmer.has("lga")) {
    dispatch(failed("Please enter farmer lga"))
    toast.error("Please enter farmer local government")
    return dispatch(reset())
  }
  if (!farmer.has("village")) {
    dispatch(failed("Please enter farmer village"))
    toast.error("Please enter farmer village")
    return dispatch(reset())
  }
  if (!farmer.has("id_type")) {
    dispatch(failed("Please enter farmer id card type"))
    toast.error("Please enter farmer id card type")
    return dispatch(reset())
  }
  if (!farmer.has("id_number")) {
    dispatch(failed("Please enter farmer id number"))
    toast.error("Please enter farmer id number")
    return dispatch(reset())
  }
  if (!farmer.has("id_card")) {
    dispatch(failed("Please upload farmer id card"))
    toast.error("Please upload farmer id card")
    return dispatch(reset())
  }
  if (!farmer.has("cooperative")) {
    dispatch(failed("Please enter farmer cooperative"))
    toast.error("Please enter farmer coperative")
    return dispatch(reset())
  }
  if (!farmer.has("role")) {
    dispatch(failed("Please enter farmer role"))
    toast.error("Please enter farmer role")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_name")) {
    dispatch(failed("Please enter farmer guarantor name"))
    toast.error("Please enter farmer guarantor name")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_number")) {
    dispatch(failed("Please enter farmer guarantor number"))
    toast.error("Please enter farmer guarantor number")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_village")) {
    dispatch(failed("Please enter farmer guarantor village"))
    toast.error("Please enter farmer guarantor name")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_id_type")) {
    dispatch(failed("Please enter farmer guarantor id type"))
    toast.error("Please enter farmer guarantor id type")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_id")) {
    dispatch(failed("Please upload farmer guarantor id card"))
    toast.error("Please upload farmer guarantor id")
    return dispatch(reset())
  }
  if (!farmer.has("guarantor_address")) {
    dispatch(failed("Please upload farmer guarantor address"))
    toast.error("Please enter farmer guarantor address")
    return dispatch(reset())
  }
  dispatch(initialize())

  const formData = Object.fromEntries(farmer)

  try {
    const respone = await http.post("/farmer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (!respone.data) {
      dispatch(failed(respone.statusText ?? respone))
      return
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      return
    }
    if (respone.data?.error) {
      dispatch(failed(respone.data.message))
      toast.error(respone.data.message)
      return dispatch(reset())
    }
    dispatch(success(respone.data))
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
    dispatch(reset())
  }
}

export const updateFarmerAction = (
  farmer: IFarmer,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  console.log(farmer)

  if (!farmer._id) {
    dispatch(failed("Wrong farmer selection"))
    return dispatch(reset())
  }

  dispatch(initialize())

  try {
    const response = await http.patch(
      `/farmer/${farmer._id}`,
      { ...farmer },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export const deleteFarmerAction = (
  farmer: IFarmer,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!farmer._id) {
    dispatch(failed("Wrong farmer selection"))
    return dispatch(reset())
  }

  dispatch(initialize())

  try {
    const response = await http.delete(`/farmer/${farmer._id}`)

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
