import { useState } from "react"
import { Button } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"
import logo from "../../../assets/puregreen-logo.png"
import Input from "../../../components/form/input"
import { useAppDispatch, useAppSelector } from "../../../store"
import { FaHashtag } from "react-icons/fa"
import { farmerLoginAction } from "../../../store/actions/farmer_auth.action"
import { farmerAuthSelector } from "../../../store/slices/farmer_auth.slice"
import { MdErrorOutline } from "react-icons/md"

function FarmerLoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error, message } = useAppSelector(farmerAuthSelector)
  const [id, setId] = useState("")

  function handleSubmit() {
    return dispatch(
      farmerLoginAction(id, () => navigate("/account/auth/verify-otp"))
    )
  }

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] md:h-fit md:max-w-lg lg:max-w-2xl md:rounded-2xl md:shadow-md bg-white md:border md:border-gray-100 p-10">
      <form className="flex flex-col w-full gap-y-2 items-center justify-center">
        <div className="flex object-contain overflow-hidden w-24 items-center justify-center">
          <img src={logo} alt="app-logo" className="object-contain" />
        </div>
        <h5 className="flex text-2xl text-green-800 font-sans font-semibold m-5">
          Welcome Back
        </h5>
        <p className="flex flex-wrap text-gray-600 text-sm text-center">
          Make direct payments with details on each transaction,
        </p>
        {error ? (
          <p className="flex flex-wrap items-baseline text-red-600 text-base text-center px-4 bg-red-100 rounded-full">
            <MdErrorOutline />
            <span>{message}</span>
          </p>
        ) : null}
        <div className="flex flex-col gap-4 w-full mt-10">
          <Input
            type="text"
            name="farmerID"
            placeholder="Enter your ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            leftIcon={<FaHashtag size={20} className="text-gray-500" />}
            className="bg-transparent"
          />
        </div>
        <div className="flex flex-col w-full items-center justify-between mb-4">
          <Button
            className="w-[80%] self-center text-base lg:text-lg p-4 leading-none tracking-wide bg-green-700 my-4"
            onClick={() => handleSubmit()}
          >
            {isLoading ? "Loading" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FarmerLoginPage
