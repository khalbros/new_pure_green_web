import { Navigate, useNavigate } from "react-router-dom"
import { currentUser } from "../apis/auth"
import { deleteToken, deleteUser, getUser, saveUser } from "../utils"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { io } from "socket.io-client"

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const l_user = getUser()
  const user = l_user ? JSON.parse(l_user) : undefined
  const token = window.sessionStorage.getItem("token")
  if (!token) {
    deleteToken()
    deleteUser()
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      currentUser()
        .then(
          (user) => {
            if (user.status === 401) {
              deleteToken()
              deleteUser()
              return navigate("/auth/login")
            }
            return saveUser(JSON.stringify(user.data.data))
          },
          (err) => {
            if (err.status === 401) {
              deleteToken()
              deleteUser()
              return navigate("/auth/login")
            }
            toast.warn(err)
            return
          }
        )
        .catch((err) => console.log("catch " + err))
      const sockect = io(
        import.meta.env.DEV
          ? "http://localhost:5000"
          : "https://puregreen-agrochemicals-api.onrender.com",
        {
          query: { userId: user?._id },
        }
      )
      sockect.on("dispatch-treated", (data) => {
        toast.info(
          <b className="">
            {data.message}
            <br />
            {String(data.message).includes("APPROVED") ? (
              <span>
                Your OTP is:{" "}
                <span className="text-blue-500 text-2xl font-bold">
                  {data.otp}
                </span>
              </span>
            ) : (
              ""
            )}
          </b>,
          {
            autoClose: false,
          }
        )
      })
      return () => {
        sockect.disconnect()
      }
    }
  }, [navigate, token, user])

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}
export default PrivateRoute
