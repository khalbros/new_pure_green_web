import {FormEvent, useEffect, useState} from "react"
import {Alert, Typography, Button} from "@material-tailwind/react"
import {MdClose, MdLock, MdMail} from "react-icons/md"
import Input from "../../components/form/input"
import logo from "../../assets/puregreen-logo.png"
import {Link, useNavigate} from "react-router-dom"
import {IAuth} from "../../interfaces/auth"
import {authSelector, reset} from "../../store/slices/auth.slice"
import {useAppDispatch, useAppSelector} from "../../store/index"
import {loginAction} from "../../store/actions/auth.action"

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {isLoading, error} = useAppSelector(authSelector)
  const [state, setState] = useState<IAuth>({email: "", password: ""})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target
    setState((prev) => ({...prev, [name]: value}))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!error) {
      return dispatch(loginAction(state, () => navigate("/")))
    }
    return
  }

  useEffect(() => {
    dispatch(reset())
  }, [state.email, state.password])
  return (
    <>
      <div className="flex items-center justify-center w-[100vw] h-[100vh] md:h-fit md:max-w-lg lg:max-w-2xl md:rounded-2xl md:shadow-md bg-white md:border md:border-gray-100 p-10">
        <form
          className="flex flex-col w-full gap-y-4"
          onSubmit={handleSubmit}
          method="post">
          <div className="flex object-contain overflow-hidden w-24 self-center">
            <img src={logo} alt="app-logo" className="object-contain" />
          </div>
          <Typography variant="h5" className="text-center text-green-800">
            Welcome Back
          </Typography>
          <Alert
            color="red"
            icon={<MdClose className="text-xl d:text:2xl" />}
            open={error ? true : false}>
            {error}
          </Alert>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            label="Email"
            value={state.email}
            onChange={(e) => handleChange(e)}
            leftIcon={<MdMail size={20} className="text-gray-500" />}
            className="bg-transparent"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            label="Password"
            value={state.password}
            onChange={(e) => handleChange(e)}
            leftIcon={<MdLock size={20} className="text-gray-500" />}
            className="bg-transparent"
          />
          <div className="flex flex-1 md:flex-row gap-2 w-full items-center justify-between mb-2">
            {/* <label
              htmlFor="remember"
              className="flex items-center gap-2 text-[12px] md:text-sm lg:text-lg cursor-pointer">
              <input
                name="remember"
                id="remember"
                type="checkbox"
                className="form-checkbox h-5 w-5 checked:bg-black checked:text-black rounded-lg border-red-400"
                color="black"
              />
              Remember me
            </label> */}

            <Link to={"/auth/forgot-password"}>
              <span className="text-green-500 font-semibold text-[14px] md:text-base lg:text-lg">
                Forgot Password?
              </span>
            </Link>
          </div>
          <Button
            type="submit"
            className="w-[80%] self-center text-base lg:text-lg p-4 leading-none bg-green-700">
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </>
  )
}

export default Login
