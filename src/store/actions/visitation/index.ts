/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IVisitation} from "../../../interfaces/visitation"
import {initialize, failed, success} from "../../slices/visitation"
import {toast} from "react-toastify"

export const createVisitationAction =
  (visitation: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!visitation.has("farmer_id")) {
      dispatch(failed("Please enter farmer id"))
      return toast.error("Please enter farmer id")
    }
    if (!visitation.has("visitation_count")) {
      dispatch(failed("Please enter visitation count"))
      return toast.error("Please enter visitation count")
    }
    if (!visitation.has("farm_location")) {
      dispatch(failed("Please select farm location"))
      return toast.error("Please select farm location")
    }
    if (!visitation.has("havest_date")) {
      dispatch(failed("Please enter expected havest time"))
      return toast.error("Please enter expected havest time")
    }
    if (!visitation.has("commodity")) {
      dispatch(failed("Please enter commodities"))
      return toast.error("Please enter commodities")
    }
    if (!visitation.has("comment")) {
      dispatch(failed("Please enter comment"))
      return toast.error("Please enter comment")
    }
    if (!visitation.has("upload")) {
      dispatch(failed("Please upload picture"))
      return toast.error("Please upload picture")
    }

    dispatch(initialize())

    try {
      const formData = Object.fromEntries(visitation)
      // const commodities = formData.commodity
      // const farm_location = formData.farm_location

      console.log(formData)

      const respone = await http.post("/visitation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(respone.data?.message)

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
        dispatch(failed(respone.data?.message))
        return toast.error(respone.data?.message)
      }
      dispatch(success(respone.data?.data))
      toast.success(respone.data?.message)
      if (respone.status === 201) callback()
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

export const updateVisitationAction =
  (visitation: IVisitation, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!visitation._id) {
      dispatch(failed("Wrong visitation selection"))
      return toast.error("Wrong visitation selection")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/visitation/${visitation._id}`, {
        ...visitation,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText ?? response)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return
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
