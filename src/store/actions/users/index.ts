/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "react"
import { ValidateEmail, deleteToken, deleteUser, http } from "../../../utils"
import { AxiosError } from "axios"
import IAxiosError from "../../../interfaces/axios.error"
import {
  createUser,
  createUserError,
  createdUser,
} from "../../slices/users/create.slice"
import {
  updateUser,
  updateUserError,
  updatedUser,
  updateUserReset,
} from "../../slices/users/update.slice"
import { IUser } from "../../../interfaces/user"
import { IPassword } from "../../../interfaces/auth"
import { toast } from "react-toastify"

export const createUserAction = (
  user: FormData,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (!user.has("name")) {
    dispatch(createUserError("Please enter your names"))
    return toast.error("Please enter your names")
  }
  if (!ValidateEmail(user.get("email") as string)) {
    dispatch(createUserError("Please enter a valid email"))
    return toast.error("Please enter a valid email")
  }
  if (!user.has("phone")) {
    dispatch(createUserError("Please enter a phone number"))
    return toast.error("Please enter a phone number")
  }
  if (!user.has("password")) {
    dispatch(createUserError("Please enter a password"))
    return toast.error("Please enter a password")
  }
  if (!user.has("gender")) {
    dispatch(createUserError("Please select a gender"))
    return toast.error("Please select a gender")
  }
  if (!user.has("role")) {
    dispatch(createUserError("Please select a role"))
    return toast.error("Please select a role")
  }

  dispatch(createUser())

  const formData = Object.fromEntries(user)

  try {
    const respone = await http.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (!respone.data) {
      dispatch(createUserError(respone.statusText))
      return toast.error(respone.statusText)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      return window.location.replace("/auth/login")
    }
    if (respone.data.data?.error) {
      dispatch(createUserError(respone.data.data.message))
      return toast.error(respone.data.data.message)
    }
    dispatch(createdUser(respone.data.data))
    callback()
  } catch (error) {
    dispatch(
      createUserError(
        ((error as AxiosError).response?.data as IAxiosError).message
      )
    )
    toast.error(((error as AxiosError).response?.data as IAxiosError).message)
  }
}

export const updateUserAction = (user: IUser, callback: () => void) => async (
  dispatch: Dispatch<any>
) => {
  if (!user._id) {
    dispatch(updateUserError("Wrong user selection;"))
    return toast.error("Wrong user selection;")
  }

  dispatch(updateUser())

  try {
    const respone = await http.patch(
      `/users/${user._id}`,
      {
        ...user,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    if (!respone.data) {
      dispatch(updateUserError(respone.statusText))
      return toast.error(respone.statusText)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()

      return window.location.replace("/auth/login")
    }
    if (respone.data?.error) {
      dispatch(updateUserError(respone.data.message))
      return toast.error(respone.data.message)
    }
    dispatch(updatedUser(respone.data.data))
    toast.success(respone.data.message)
    return callback()
  } catch (error) {
    dispatch(
      updateUserError(
        ((error as AxiosError).response?.data as IAxiosError).message
      )
    )
    toast.error(((error as AxiosError).response?.data as IAxiosError).message)
  }
}
export const resetUserPasswordAction = (
  user: IUser,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  dispatch(updateUser())

  try {
    const respone = await http.post(
      `/auth/reset-manual`,
      {
        ...user,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    if (!respone.data) {
      dispatch(updateUserError(respone.statusText))
      return toast.error(respone.statusText)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()

      return window.location.replace("/auth/login")
    }
    if (respone.data?.error) {
      dispatch(updateUserError(respone.data.message))

      toast.error(respone.data.message)
      return callback()
    }
    dispatch(updatedUser(respone.data.data))
    toast.success(respone.data.message)
    return callback()
  } catch (error) {
    dispatch(
      updateUserError(
        ((error as AxiosError).response?.data as IAxiosError).message
      )
    )
    toast.error(((error as AxiosError).response?.data as IAxiosError).message)
  }
}

export const changepasswordAction = (
  credential: IPassword,
  callback: () => void
) => async (dispatch: Dispatch<any>) => {
  if (credential.old_password === "" || credential.old_password === undefined) {
    dispatch(updateUserError("please enter your current password"))
    return toast.error("please enter your current password")
  }
  if (credential.new_password === "" || credential.new_password === undefined) {
    dispatch(updateUserError("please enter a new password"))
    return toast.error("please enter a new password")
  }

  dispatch(updateUser())

  try {
    const respone = await http.post("/auth/change-password", credential)
    if (!respone.data) {
      dispatch(updateUserError(respone.statusText))
      return toast.error(respone.statusText)
    }
    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      return window.location.replace("/auth/login")
    }
    if (respone.data.data?.error) {
      dispatch(updateUserError(respone.data.data.message))
      return toast.error(respone.data.data.message)
    }
    dispatch(updatedUser(undefined))
    return callback()
  } catch (error) {
    dispatch(
      updateUserError(
        ((error as AxiosError).response?.data as IAxiosError)?.message
      )
    )
    toast.error(((error as AxiosError).response?.data as IAxiosError)?.message)
  }
}

export const deleteUserAction = (bundle: IUser, callback: () => void) => async (
  dispatch: Dispatch<any>
) => {
  if (!bundle._id) {
    dispatch(updateUserError("Wrong disbursement selection"))
    return dispatch(updateUserReset())
  }

  dispatch(updateUser())

  try {
    const response = await http.delete(`/users/${bundle._id}`)

    if (response.status === 401) {
      deleteToken()
      deleteUser()
      window.location.replace("/")
      toast.error(response.status)
      return dispatch(updateUserReset())
    }
    if (!response.data) {
      dispatch(updateUserError(response.statusText))
      toast.error(response.status)
      return dispatch(updateUserReset())
    }
    if (response.data.data?.error) {
      dispatch(updateUserError(response.data.data.message))
      toast.error(response.data.data.message)
      return dispatch(updateUserReset())
    }

    dispatch(updatedUser(response.data.data))
    toast.success(response.data.message)
    callback()
  } catch (err) {
    dispatch(
      updateUserError(
        ((err as AxiosError).response?.data as IAxiosError).message ??
          (err as any)?.message
      )
    )
    toast.error((err as any).message)
    dispatch(updateUserReset())
  }
}
