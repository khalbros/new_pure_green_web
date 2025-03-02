import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { Outlet, useNavigate } from "react-router-dom"

function FinanceManagement() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="h-full p-4 lg:px-8 lg:py-6">
      <div className="flex gap-4 items-center">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace className="mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
        </span>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
          Finance management
        </h3>
      </div>
      <Outlet />
    </div>
  )
}

export default FinanceManagement
