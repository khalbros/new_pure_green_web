/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import {MdOutlineKeyboardBackspace} from "react-icons/md"
import {useLocation, useNavigate} from "react-router-dom"

import {ITransaction} from "../../../../interfaces/transaction"
import {useAppDispatch, useAppSelector} from "../../../../store"
import Select from "../../../../components/form/select"
import {TransactionContext} from "../"
import {transactionSelector} from "../../../../store/slices/transaction"
import {
  createTransactionAction,
  updateTransactionAction,
} from "../../../../store/actions/transaction"
import {reset} from "../../../../store/slices/transaction"
import {fetchData} from "../../../../utils"
import {IClient} from "../../../../interfaces/client"
import {ICommodity} from "../../../../interfaces/commodity"
import {IGrade} from "../../../../interfaces/grade"
import Input from "../../../../components/form/input"
import {Button} from "@material-tailwind/react"

const initialState: ITransaction = {
  type: undefined,
  client: undefined,
  commodity: undefined,
  gross_weight: undefined,
  net_weight: undefined,
  duration: undefined,
  num_bags: undefined,
  truck_number: undefined,
  driver: undefined,
  amount: undefined,
}
const transactionReducer = (prev: ITransaction, next: ITransaction) => ({
  ...prev,
  ...next,
})

const TransactionStorageForm = () => {
  const [state, setState] = useReducer(transactionReducer, initialState)
  const [existingInput, clearInput] = useContext(TransactionContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [client, setClientSuggestion] = useState<IClient[]>()
  const [commodity, setCommoditySuggestion] = useState<ICommodity[]>()
  const [grade, setGradeSuggestion] = useState<IGrade[]>()
  const [_selectedCommodity, setSelectedCommodity] = useState<ICommodity>()
  const [gradePercentage, setGradePercentage] = useState<number>()

  // const inputRef = useRef<HTMLInputElement>(null)
  const transactionState = useAppSelector(transactionSelector)

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
    if (name === "commodity") {
      const comm = commodity?.find((g) => g._id === value)
      if (comm) {
        setSelectedCommodity(comm)
        setState({...state, commodity: comm._id})
      }
    }
    if (name === "grade") {
      const grd = grade?.find((g) => g._id === value)

      if (grd) {
        setGradePercentage(grd.percentage)
        setState({...state, grade: value})
      }
    }
    if (name === "gross_weight") {
      setState({
        ...state,
        gross_weight: value,
        net_weight: String(
          Number(value) -
            Number(Number(value) * Number(Number(gradePercentage) / 100))
        ),
      })
    }
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    if (edit) {
      dispatch(
        updateTransactionAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    // const formdata = Object.fromEntries(data)
    // console.log(formdata)

    dispatch(
      createTransactionAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  // function payable() {
  //   return (
  //     Number(
  //       2.5 *
  //         Number(selectedCommodity?.price?.storage) *
  //         Number(state?.num_bags)
  //     ) *
  //       Number(state?.duration) -
  //     Number(state?.logistics_fee ?? 0) -
  //     Number(state?.handling_fee ?? 0)
  //   )
  // }

  useEffect(() => {
    if (existingInput) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {type, ...rest} = existingInput
      setState(rest)
    }
    fetchData("/client")
      .then((res) => {
        if (res.data) setClientSuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/commodity")
      .then((res) => {
        if (res.data) setCommoditySuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/grade")
      .then((res) => {
        if (res.data) setGradeSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)
      clearInput({})
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
        <h4 className="text-xl lg:text-2xl text-green-500">Storage Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <Input
            label="Transaction type"
            type="text"
            name="type"
            value="Storage"
          />

          <>
            <Input
              label="Client id"
              type="search"
              list="client_name"
              autoComplete="client"
              name="client"
              onChange={handleChange}
              value={state.client}
            />
            <datalist
              id="client_name"
              placeholder="enter client name"
              className="w-full">
              {client?.map((client, index) => {
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
          <Select
            name="commodity"
            label="Commodity"
            placeholder=""
            inputContainerStyle=""
            onChange={handleChange}
            value={state?.commodity}>
            <option selected>Select commodity</option>
            {commodity?.map((commodity, index) => {
              return (
                <option
                  key={index}
                  value={commodity._id}
                  className="flex p-5 justify-between">
                  <span>{commodity.name}</span>
                </option>
              )
            })}
          </Select>
          <Select
            name="grade"
            label="Grade"
            placeholder=""
            inputContainerStyle=""
            onChange={handleChange}
            value={state?.grade}>
            <option selected>Select Grade</option>
            {grade?.map((grd, index) => {
              return (
                <option
                  key={index}
                  value={grd._id}
                  className="flex p-5 justify-between">
                  <span>{grd.name}</span>
                </option>
              )
            })}
          </Select>
          <Input
            label="Gross Weight"
            name="gross_weight"
            onChange={handleChange}
            value={state.gross_weight}
          />
          <Input
            label="Net Weight"
            name="net_weight"
            value={state.net_weight}
          />
          <Input
            label="Number of bags"
            name="num_bags"
            onChange={handleChange}
            value={state.num_bags}
          />
          <Select
            name="duration"
            label="Duration (months)"
            placeholder=""
            inputContainerStyle=""
            onChange={handleChange}
            value={state?.duration}>
            <option selected>Select duration</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, index) => (
              <option key={index} value={m}>
                {m}
              </option>
            ))}
          </Select>
          <Input
            label="Handling fees"
            name="handling_fee"
            onChange={handleChange}
            value={state?.handling_fee}
          />
          <Input
            label="Payable Amount"
            name="amount"
            onChange={handleChange}
            value={
              Number(
                250 *
                  Number(state?.num_bags ?? 1) *
                  Number(state?.duration ?? 1)
              ) - Number(state?.handling_fee ?? 0)
            }
          />
          <Input
            label="Driver Name"
            name="driver"
            onChange={handleChange}
            value={state.driver}
          />
          <Input
            label="Truck Number"
            name="truck_number"
            onChange={handleChange}
            value={state.truck_number}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={transactionState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {transactionState.isLoading
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

export default TransactionStorageForm
