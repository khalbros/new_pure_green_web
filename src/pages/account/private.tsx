import { Navigate } from "react-router-dom"
import { getFarmer } from "../../utils"

function PrivateLayout({ children }: { children: JSX.Element }) {
  const farmer = getFarmer()

  if (farmer) {
    return children
  }
  return <Navigate to="/account/auth/login" replace />
}

export default PrivateLayout
