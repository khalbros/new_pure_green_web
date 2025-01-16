/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch} from "react"
import {deleteToken, deleteUser, http} from "../../../utils"
import {AxiosError} from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {IProject} from "../../../interfaces/project"
import {initialize, failed, success} from "../../slices/project"
import {toast} from "react-toastify"

export const createProjectAction =
  (project: FormData, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!project.has("name")) {
      dispatch(failed("Please enter project name"))
      return
    }
    if (!project.has("code")) {
      dispatch(failed("Please enter project code"))
      return
    }
    if (!project.has("start")) {
      dispatch(failed("Please select a start date"))
      return
    }

    dispatch(initialize())

    const formData = Object.fromEntries(project)

    try {
      const respone = await http.post("/project", formData)
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

export const updateProjectAction =
  (project: IProject, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!project._id) {
      dispatch(failed("Wrong project selection"))
      return
    }

    dispatch(initialize())
    console.log("update called")

    try {
      const response = await http.patch(`/project/${project._id}`, {
        ...project,
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

export const deleteProjectAction =
  (project: IProject, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (!project._id) {
      dispatch(failed("Wrong project selection"))
      return
    }

    dispatch(initialize())
    console.log("update called")

    try {
      const response = await http.delete(`/project/${project._id}`)
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
