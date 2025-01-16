/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {ITeam} from "../../../interfaces/team"
import {initialize, failed, success} from "../../slices/team"
import {toast} from "react-toastify"

export const createTeamAction =
  (team: FormData, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (!team.has("name")) {
      dispatch(failed("Please enter team name"))
      return toast.error("Please enter team name")
    }
    if (!team.has("supervisor")) {
      dispatch(failed("Please select supervisor"))
      return toast.error("Please select supervisor")
    }
    if (!team.has("cooperativies")) {
      dispatch(failed("Please select a cooperativies"))
      return toast.error("Please select a cooperativies")
    }

    dispatch(initialize())

    const formData = Object.fromEntries(team)
    const cooperativies = formData.cooperativies

    try {
      const respone = await http.post("/team", {
        ...formData,
        cooperativies: JSON.parse(cooperativies as never),
      })
      if (!respone.data) {
        dispatch(failed(respone.statusText ?? respone))
        return toast.error(respone.statusText ?? respone)
      }
      if (respone.status === 401) {
        deleteToken()
        deleteUser()
        return toast.warn("please login")
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

export const updateTeamAction =
  (team: ITeam, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (!team._id) {
      dispatch(failed("Wrong team selection"))
      return toast.error("Wrong team selection")
    }

    dispatch(initialize())

    try {
      const response = await http.patch(`/team/${team._id}`, {
        ...team,
      })
      if (!response.data) {
        dispatch(failed(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.status === 401) {
        deleteToken()
        deleteUser()
        return toast.error("please login")
      }
      if (response.data.data?.error) {
        dispatch(failed(response.data.data.message))
        return toast.error(response.data.data.message)
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
