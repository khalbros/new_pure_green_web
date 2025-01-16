/* eslint-disable @typescript-eslint/no-explicit-any */

import {AxiosError} from "axios"
import {Dispatch} from "react"
import {AsyncSaveItem, deleteToken, deleteUser} from "../../utils"
import {
  authenticate,
  authenticated,
  authenticationError,
  signout,
} from "../slices/auth.slice"
import IAxiosError from "../../interfaces/axios.error"

import {IAuth} from "../../interfaces/auth"
import {
  currentUser,
  forgot_password,
  login,
  logout,
  reset_password,
  verify_otp,
} from "../../apis/auth"
import {toast} from "react-toastify"

export const loginAction =
  (auth: IAuth, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (auth.email === "" || auth.email === undefined) {
      dispatch(authenticationError("please enter your email"))
      return
    }

    if (auth.password === "" || auth.password === undefined) {
      dispatch(authenticationError("please enter your password"))
      return
    }

    dispatch(authenticate())

    try {
      const response = await login(auth)
      if (!response.data) {
        dispatch(authenticationError(response.statusText))
      }
      if (response.data.error) {
        dispatch(authenticationError(response.data.message))
      }

      const user = await currentUser()
      await AsyncSaveItem("token", response.data.token)
      await AsyncSaveItem("user", user.data.data)
      dispatch(authenticated(user.data.data))
      callback()
      return
    } catch (error) {
      dispatch(
        authenticationError(
          ((error as AxiosError).response?.data as IAxiosError)?.message ??
            (error as any)?.message
        )
      )
    }
  }

export const logoutAction =
  (callback: () => void) => async (dispatch: Dispatch<any>) => {
    dispatch(authenticate())
    try {
      deleteToken()
      deleteUser()
      await logout()
        .then((response) => {
          if (!response.data) {
            dispatch(authenticationError(response.statusText))
            window.location.replace("/auth/login")
          }
          console.log("logout")

          dispatch(signout())
          callback()
          return window.location.replace("/auth/login")
        })
        .catch(() => window.location.replace("/auth/login"))
    } catch (error) {
      dispatch(
        authenticationError(
          ((error as AxiosError).response?.data as IAxiosError)?.message ??
            (error as any)?.message
        )
      )
    }
  }

export const forgotPassword =
  (email: string, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (email === "" || email === undefined) {
      dispatch(authenticationError("please enter your email"))
      return toast.error("please enter your email")
    }

    dispatch(authenticate())

    try {
      const response = await forgot_password(email)
      if (!response.data) {
        dispatch(authenticationError(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.data.error) {
        dispatch(authenticationError(response.data.message))
        return toast.error(response.data.message)
      }

      await AsyncSaveItem("user", response.data.data)
      toast.success(response.data.message)
      callback()
      return
    } catch (error) {
      dispatch(
        authenticationError(
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

export const resetPassword =
  (password: string, callback: () => void) =>
  async (dispatch: Dispatch<any>) => {
    if (password === "" || password === undefined) {
      dispatch(authenticationError("please enter your email"))
      return
    }

    dispatch(authenticate())

    try {
      const response = await reset_password(password)
      if (!response.data) {
        dispatch(authenticationError(response.statusText))
      }
      if (response.data.error) {
        dispatch(authenticationError(response.data.message))
      }
      callback()
      return
    } catch (error) {
      dispatch(
        authenticationError(
          ((error as AxiosError).response?.data as IAxiosError)?.message ??
            (error as any)?.message
        )
      )
    }
  }

export const verifyOTP =
  (otp: string, callback: () => void) => async (dispatch: Dispatch<any>) => {
    if (otp === "" || otp === undefined) {
      dispatch(authenticationError("please enter your email"))
      return toast.error("please enter your email")
    }

    dispatch(authenticate())

    try {
      const response = await verify_otp(otp)
      if (!response.data) {
        dispatch(authenticationError(response.statusText))
        return toast.error(response.statusText)
      }
      if (response.data.error) {
        dispatch(authenticationError(response.data.message))
        return toast.error(response.data.message)
      }

      await AsyncSaveItem("user", response.data.data)
      toast.success(response.data.message)
      callback()
      return
    } catch (error) {
      dispatch(
        authenticationError(
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
