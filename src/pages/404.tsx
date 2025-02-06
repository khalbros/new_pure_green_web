import { useRouteError } from "react-router-dom"
import logo from "../assets/puregreen-logo.png"
interface IError {
  statusText: string
  message: string
}
function ErrorPage() {
  const error = useRouteError()

  return (
    <div
      id="error-page"
      className="flex flex-col w-[100vw] h-[100vh] items-center justify-center bg-gradient-to-br from-cyan-600 to-green-600 text-white">
      <div className="flex object-contain overflow-hidden w-24 self-center m-2 p-2 bg-white rounded-xl">
        <img src={logo} alt="app-logo" className="object-contain" />
      </div>
      <h1 className="text-xl lg:text-2xl">Oops!</h1>
      <p className="text-2xl lg:text-4xl font-extrabold m-2">
        <i className="">
          Page {(error as IError)?.statusText || (error as IError)?.message}!
        </i>
      </p>
    </div>
  )
}

export default ErrorPage
