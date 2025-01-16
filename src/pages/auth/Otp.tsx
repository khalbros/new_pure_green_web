/* eslint-disable @typescript-eslint/no-explicit-any */
import {ChangeEvent, useEffect, useRef, useState} from "react"
import {Button} from "@material-tailwind/react"
import logo from "../../assets/puregreen-logo.png"
import {FiArrowLeft} from "react-icons/fi"
import {Link, useNavigate} from "react-router-dom"
import {getUser} from "../../utils"
import {verifyOTP} from "../../store/actions/auth.action"
import {useAppDispatch} from "../../store"

const Otp = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [otp, setOtp] = useState<string[]>([])

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value.length > 0 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleInputPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text")
    const otpArray = pasteData.split("").slice(0, inputRefs.length)
    otpArray.forEach((value, index) => {
      inputRefs[index].current!.value = value
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus()
      }
    })

    if (otpArray.length === 4) {
      setOtp(otpArray)
    }
    e.preventDefault()
  }

  const handleInputKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs[index - 1].current?.focus()
    }
  }

  function handleSubmit() {
    return dispatch(
      verifyOTP(otp.join(""), () => navigate("/auth/reset-password"))
    )
  }

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] md:h-fit md:max-w-lg lg:max-w-2xl md:rounded-2xl md:shadow-md bg-white md:border md:border-gray-100 p-10">
      <form className="flex flex-col w-full gap-y-4 items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex object-contain overflow-hidden w-24 items-center justify-center">
            <img src={logo} alt="app-logo" className="object-contain" />
          </div>
          <h5 className="flex text-2xl text-green-800 font-sans font-semibold m-5">
            Password reset
          </h5>
          <p className="flex flex-wrap text-gray-600 text-sm text-center gap-1">
            We sent a code to{" "}
            <span className="text-black font-bold">{getUser()}</span>
          </p>
        </div>
        {/*  */}
        <div className="flex flex-1 items-center justify-center mt-4">
          {inputRefs?.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              value={otp[index] || ""}
              type="text"
              maxLength={1}
              className={`w-10 h-10 md:w-12 md:h-12 m-3 p-2 text-2xl md:text-3xl text-center border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-700 ${
                otp[index] && "ring-2 ring-green-700 text-green-900"
              }`}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleInputKeyDown(e, index)}
              onPaste={handleInputPaste}
            />
          ))}
        </div>
        {/*  */}
        <div className="flex flex-col w-full items-center justify-between my-4 gap-5">
          <Button
            className="bg-green-700 w-[80%] text-base lg:text-lg p-4"
            onClick={() => handleSubmit()}>
            Verify
          </Button>
          <p className="flex flex-wrap text-gray-600 text-center gap-1">
            Didn't receive an email?{" "}
            <span className="text-green-500 font-bold">
              Click here to resend
            </span>
          </p>
          <div className="flex w-[80%] items-center justify-center">
            <Link to={"/"} className="flex items-center gap-2 lg:gap-3">
              <FiArrowLeft className="text-base lg:text-lg" />
              <span className="text-base lg:text-lg">Back to login</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Otp
