/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import {MdOutlineKeyboardBackspace} from "react-icons/md"
import {useLocation, useNavigate} from "react-router-dom"
import {Button} from "@material-tailwind/react"
import {IPayment} from "../../../interfaces/payment"
import {useAppDispatch, useAppSelector} from "../../../store"
import {paymentSelector} from "../../../store/slices/finance/payment"
import {createPaymentAction} from "../../../store/actions/finance"
import {reset} from "../../../store/slices/finance/payment"
import {fetchData} from "../../../utils"
import Input from "../../../components/form/input"
import {IClient} from "../../../interfaces/client"
import {toast} from "react-toastify"
import {IDispatch} from "../../../interfaces/dispatch"

const initialState: IPayment = {}
const paymentReducer = (prev: IPayment, next: IPayment) => ({
  ...prev,
  ...next,
})

const PaymentForm = () => {
  const [state, setState] = useReducer(paymentReducer, initialState)
  const location = useLocation()
  const [clients, setClientSuggestion] = useState<IClient[]>()
  const [_dispatches, setDispatches] = useState<IDispatch[]>()

  const client = useMemo(
    () => clients?.find((client) => client.client_id === state.client_id),
    [state.client_id]
  )
  // const inputRef = useRef<HTMLInputElement>(null)
  const paymentState = useAppSelector(paymentSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target

    setState({...state, [name]: value})
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    dispatch(
      createPaymentAction(data, () => {
        toast.success(`Payment Successful!`)
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    fetchData("/client")
      .then((res) => {
        if (res.data) setClientSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)

      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    fetchData(`/dispatch?client=${client?._id}`)
      .then((res) => {
        if (res.data) setDispatches(res.data)
      })
      .catch((err) => console.log(err))
  }, [location.pathname, client?._id])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace
            size={30}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Payment Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <>
            <Input
              label="Client id"
              type="search"
              list="client_name"
              autoComplete="client"
              name="client_id"
              onChange={handleChange}
              value={state.client_id}
            />
            <datalist
              id="client_name"
              placeholder="enter client name"
              className="w-full">
              {clients?.map((client, index) => {
                return (
                  <option
                    key={index}
                    className="w-full"
                    value={client.client_id}
                    children={client.name}
                  />
                )
              })}
            </datalist>
          </>

          <Input
            label="Payment Amount"
            name="amount"
            type="number"
            onChange={handleChange}
            value={state.amount}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={paymentState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {paymentState.isLoading ? "Loading..." : "submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm
