import { lazy, Suspense, useMemo } from "react"
import { getUser } from "../../utils"

const FieldOfficerDashboard = lazy(() => import("./field-officer"))
const WarehouseManagerDashboard = lazy(() => import("./warehouse-manager"))
const AreaSalesManagerDashboard = lazy(() => import("./area-sales-manager"))
const SupervisorDashboard = lazy(() => import("./supervisor"))
const AdminDashboard = lazy(() => import("./admin"))
const SuperAdminDashboard = lazy(() => import("./super-admin"))
const FinanceOfficerDashboard = lazy(() => import("./finance"))

function Dashboard() {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  if (user.role === "FIELD OFFICER") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <FieldOfficerDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "WAREHOUSE ADMIN") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <SupervisorDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "WAREHOUSE MANAGER") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <WarehouseManagerDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "AREA SALES MANAGER") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <AreaSalesManagerDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "FINANCIAL OFFICER") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <FinanceOfficerDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "DATA ANALYST") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <AdminDashboard />
        </Suspense>
      </div>
    )
  }
  if (user.role === "SUPER ADMIN") {
    return (
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <Suspense>
          <SuperAdminDashboard />
        </Suspense>
      </div>
    )
  }
}

export default Dashboard
