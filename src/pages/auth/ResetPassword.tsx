import {useState, FormEvent} from "react"
import {Button, Alert} from "@material-tailwind/react"
import {FaEye, FaEyeSlash} from "react-icons/fa"
import {useNavigate} from "react-router-dom"
import logo from "../../assets/puregreen-logo.png"

import Input from "../../components/form/input"
import {MdError, MdLock} from "react-icons/md"
import {useAppDispatch, useAppSelector} from "../../store"
import {authSelector} from "../../store/slices/auth.slice"
import {resetPassword} from "../../store/actions/auth.action"

function ResetPassword() {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [mismatch, setMismatch] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const toggleShow = () => setShow(!show)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {isLoading, error} = useAppSelector(authSelector)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMismatch(true)
      return
    }

    return dispatch(resetPassword(password, () => navigate("/auth/login")))
  }

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] md:h-fit md:max-w-lg lg:max-w-2xl md:rounded-2xl md:shadow-md bg-white md:border md:border-gray-100 p-10">
      <form className="flex flex-col w-full gap-y-4" onSubmit={handleSubmit}>
        <div className="flex object-contain overflow-hidden self-center w-24 items-center justify-center ">
          <img src={logo} alt="app-logo" className="object-contain" />
        </div>
        <h5 className="flex text-2xl justify-center text-green-800 font-sans font-semibold">
          Set new password
        </h5>

        <div className="flex flex-col gap-4 w-full">
          <Alert color="red" icon={<MdError size={24} />} open={mismatch}>
            Passwords do not match
          </Alert>
          <Alert color="red" icon={<MdError size={24} />} open={!!error}>
            {error}
          </Alert>
          <div className="flex flex-col">
            <Input
              type={show ? "text" : "password"}
              name="password"
              label="Password"
              className="bg-transparent"
              leftIcon={<MdLock size={20} className="text-gray-500" />}
              rightIcon={
                show ? (
                  <FaEyeSlash size={20} onClick={toggleShow} />
                ) : (
                  <FaEye size={20} onClick={toggleShow} />
                )
              }
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <Input
            type={show ? "text" : "password"}
            name="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            className="bg-transparent"
            leftIcon={<MdLock size={20} className="text-gray-500" />}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightIcon={
              show ? (
                <FaEyeSlash size={20} onClick={toggleShow} />
              ) : (
                <FaEye size={20} onClick={toggleShow} />
              )
            }
          />
        </div>
        <div className="flex flex-col w-full items-center justify-between my-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-700 w-[80%] text-base lg:text-lg p-4 my-4">
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword
