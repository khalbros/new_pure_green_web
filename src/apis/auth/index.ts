import { IAuth, IPassword } from "../../interfaces/auth"
import { http } from "../../utils"

export const login = async (auth: IAuth) => await http.post("/auth/login", auth)
export const farmerLogin = async (id: string) =>
  await http.post("/auth/farmer/login", { farmerID: id })
export const verify_otp = async (otp: string) =>
  await http.post("/auth/verify-otp", { otp })
export const forgot_password = async (email: string) =>
  await http.post("/auth/forgot-password", { email })
export const reset_password = async (password: string) =>
  await http.post("/auth/reset-password", password)

export const currentUser = async () => await http.get("/users/profile")

export const logout = async () => await http.post("/auth/logout")

export const changepassword = async (credential: IPassword) =>
  await http.post("/change-password", credential)
