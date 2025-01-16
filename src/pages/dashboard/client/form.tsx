import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { IClient } from "../../../interfaces/client"
import { Button } from "@material-tailwind/react"
import Input from "../../../components/form/input"
import { useAppDispatch, useAppSelector } from "../../../store"
import { clientSelector } from "../../../store/slices/client"
import {
  createClientAction,
  updateClientAction,
} from "../../../store/actions/client"
import { ClientContext } from "."
import { reset } from "../../../store/slices/warehouse"

const initialState: IClient = {
  _id: undefined,
  name: undefined,
  email: undefined,
  phone: undefined,
  address: undefined,
  bank_name: undefined,
  account_number: undefined,
}
const createClientReducer = (prev: IClient, next: IClient) => ({
  ...prev,
  ...next,
})

const ClientForm = () => {
  const [state, setState] = useReducer(createClientReducer, initialState)

  const [existingClient, clearClient] = useContext(ClientContext)

  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const clientState = useAppSelector(clientSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    if (edit) {
      dispatch(
        updateClientAction(state, () => {
          navigate(-1)
        })
      )
      return
    }

    dispatch(
      createClientAction(data, () => {
        navigate(-1)
      })
    )

    return
  }

  useEffect(() => {
    if (existingClient) {
      const { ...rest } = existingClient
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearClient({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace
            size={24}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">
          Client Enrollment Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="name"
            label="Full name"
            inputContainerStyle="col-span-2 w-full"
            placeholder="enter client full name"
            value={state?.name}
            onChange={handleChange}
          />

          <Input
            name="email"
            label="Email address*"
            placeholder="example@email.com"
            onChange={handleChange}
            value={state?.email}
          />
          <Input
            name="phone"
            label="Phone number*"
            placeholder="080XXXXXXX9"
            value={state?.phone}
            onChange={handleChange}
          />
          <Input
            name="account_number"
            label="Account number*"
            placeholder="10XXXXXXXX1"
            value={state?.account_number}
            onChange={handleChange}
          />
          <Input
            name="bank_name"
            label="Bank name*"
            placeholder="First Bank"
            value={state?.bank_name}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Residential address*"
            placeholder="Block C9, street"
            inputContainerStyle="col-span-2 lg:w-[80%]"
            value={state?.address}
            onChange={handleChange}
          />
          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={clientState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {clientState.isLoading
                ? "Loading..."
                : edit
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientForm
