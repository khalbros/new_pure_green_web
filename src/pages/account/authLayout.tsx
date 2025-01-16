import { Navigate, Outlet } from "react-router-dom"
import { getFarmer } from "../../utils"

function AccountAuthLayout() {
  const farmer = getFarmer()
  if (!farmer) {
    return (
      <div className="flex flex-wrap flex-col w-[100vw] h-[100vh] box-border items-center justify-center">
        <Outlet />
      </div>
    )
  }
  return <Navigate to="/account" replace />
}

export default AccountAuthLayout
