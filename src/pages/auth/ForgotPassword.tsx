import { useState } from "react"
import { Button } from "@material-tailwind/react"
import { MdEmail } from "react-icons/md"
import { FiArrowLeft } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/puregreen-logo.png"
import Input from "../../components/form/input"
import { useAppDispatch, useAppSelector } from "../../store"
import { authSelector } from "../../store/slices/auth.slice"
import { forgotPassword } from "../../store/actions/auth.action"

function ForgotPassword() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector(authSelector)
  const [email, setEmail] = useState("")

  function handleSubmit() {
    return dispatch(forgotPassword(email, () => navigate("/auth/verify-otp")))
  }

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] md:h-fit md:max-w-lg lg:max-w-2xl md:rounded-2xl md:shadow-md bg-white md:border md:border-gray-100 p-10">
      <form className="flex flex-col w-full gap-y-2 items-center justify-center">
        <div className="flex object-contain overflow-hidden w-24 items-center justify-center">
          <img src={logo} alt="app-logo" className="object-contain" />
        </div>
        <h5 className="flex text-2xl text-green-800 font-sans font-semibold m-5">
          Forgot password
        </h5>
        <p className="flex flex-wrap text-gray-600 text-sm text-center">
          Can't remember your password? <br /> You can reset it with your email
          address
        </p>
        <div className="flex flex-col gap-4 w-full mt-10">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<MdEmail size={20} className="text-gray-500" />}
            className="bg-transparent"
          />
        </div>
        <div className="flex flex-col w-full items-center justify-between mb-4">
          <Button
            className="w-[80%] self-center text-base lg:text-lg p-4 leading-none bg-green-700 my-4"
            onClick={() => handleSubmit()}
          >
            {isLoading ? "Loading" : "Reset Password"}
          </Button>
          <div className="flex w-[80%] items-center justify-center">
            <Link to={"/"} className="flex items-center gap-2 lg:gap-3">
              <FiArrowLeft className="text-md lg:text-xl" />
              <span className="text-base lg:text-lg p-2">Back to login</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
