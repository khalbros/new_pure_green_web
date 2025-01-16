/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import moment from "moment"
import { toast } from "react-toastify"
import * as xlsx from "xlsx"

export const GOOGLE_MAPS_API_KEY = "AIzaSyBKfZ8DFU5Lyu0u0WF4AQTPM4XGokIbuo0"

const baseURL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://puregreen-agrochemicals-api.onrender.com/api"

export const http = axios.create({
  baseURL,
  withCredentials: true,
})

http.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem("token")
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config
})

export const saveToken = (value: string) => {
  window.sessionStorage.setItem("token", value)
}

export const getToken = () => {
  return window.sessionStorage.getItem("token")
}
export const deleteToken = () => {
  window.sessionStorage.removeItem("token")
}

export const saveUser = (value: string) => {
  window.sessionStorage.setItem("user", value)
}

export const getUser = () => window.sessionStorage.getItem("user")

export const saveFarmer = (value: string) =>
  window.sessionStorage.setItem("farmer", value)
export const getFarmer = () => window.sessionStorage.getItem("farmer")

export const deleteUser = () => {
  window.sessionStorage.removeItem("user")
  window.localStorage.removeItem("user")
}

export async function AsyncSaveItem(key: string, value: string) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export async function AsyncGetItem(key: string) {
  const item = window.sessionStorage.getItem(key)
  return JSON.parse("" + item)
}
export async function AsyncDeleteItem(key: string) {
  return window.sessionStorage.removeItem(key)
}

export const dateTimeFormatter = (date: string): string =>
  moment(date).format("Do MMMM, h:mm:ss A ")

export const timeFormatter = (date: string): string =>
  moment(date).format("Do MMMM, YYYY h:mm:ss A ")

export const shortDateFormatter = (date: string): string =>
  moment(date).format("D MMM, YYYY")

export const orderDateFormatter = (date: string): string =>
  moment(date).format("dd, Do MMM h:mm:ss A")

export function formatToCurrency(amount?: number) {
  return amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
}

export function getTimeAgo(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffMinutes = Math.round(diff / (1000 * 60))
  const diffHours = Math.round(diff / (1000 * 60 * 60))
  const diffDays = Math.round(diff / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return "Just now"
  } else if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else {
    return `${diffDays} days ago`
  }
}

export interface IFile {
  uri: string
  type: string
  name: string
}

interface ICloudinary {
  secure_url: string
  public_id: string
}

export const ValidateEmail = (email: string): boolean => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

export const cloudinaryUpload = async (file: any): Promise<ICloudinary> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "jimdhhpn")
  formData.append("cloud_name", "autobus")

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/autobus/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return await response.data
}

export const fetchData = async (url: string) => {
  try {
    const respone = await http.get(url)

    if (respone.status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("session expire please login")
      window.location.replace("/auth/login")
      return { message: respone.data.data?.message, data: undefined }
    }

    if (!respone.data) {
      return { message: respone.data.data?.message, data: undefined }
    }

    if (respone.data.data?.error) {
      return { message: respone.data.data?.message, data: undefined }
    }
    return {
      message: respone.data?.message,
      data: respone.data?.data,
    }
  } catch (err) {
    if ((err as any).status === 401) {
      deleteToken()
      deleteUser()
      toast.warn("session expire please login")
      window.location.replace("/auth/login")
    }

    return {
      message: (err as any).response?.data.message ?? (err as any)?.message,
      data: undefined,
    }
  }
}

// generate excel file
export const generateExcelFile = async (data: any, filename: string) => {
  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(data)
  xlsx.utils.book_append_sheet(wb, ws)
  xlsx.writeFile(wb, `${filename}.xlsx`)
}
