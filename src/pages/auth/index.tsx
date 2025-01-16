import {Navigate, Outlet} from "react-router-dom"
import {getUser} from "../../utils"

function AuthLayout() {
  const user = getUser()

  if (!user) {
    return (
      <div className="flex flex-1 w-[100vw] h-[100vh] items-center justify-center bg-green-500">
        <Outlet />
      </div>
    )
  }
  return <Navigate to="/" replace />
}

export default AuthLayout
