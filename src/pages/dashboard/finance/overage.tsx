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
import {IOverage} from "../../../interfaces/overage"
import {useAppDispatch, useAppSelector} from "../../../store"
import {overageSelector} from "../../../store/slices/finance/overage"
import {createOverageAction} from "../../../store/actions/finance"
import {reset} from "../../../store/slices/finance/overage"
import {fetchData} from "../../../utils"
import Input from "../../../components/form/input"
import {IFarmer} from "../../../interfaces/farmer"
import {toast} from "react-toastify"
import {IDisbursement} from "../../../interfaces/disbursement"

const initialState: IOverage = {}
const overageReducer = (prev: IOverage, next: IOverage) => ({
  ...prev,
  ...next,
})

const OverageForm = () => {
  const [state, setState] = useReducer(overageReducer, initialState)
  const location = useLocation()
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()
  const [disbursement, setDisbursment] = useState<IDisbursement[]>()

  const farmer = useMemo(
    () => farmers?.find((farmer) => farmer.farmer_id === state.farmer_id),
    [state.farmer_id]
  )
  // const inputRef = useRef<HTMLInputElement>(null)
  const overageState = useAppSelector(overageSelector)

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
      createOverageAction(data, () => {
        toast.success(`Overaged Paid!`)
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    fetchData("/farmer")
      .then((res) => {
        if (res.data) setFarmerSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)

      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    fetchData(`/disbursement?farmer=${farmer?._id}`)
      .then((res) => {
        if (res.data) setDisbursment(res.data)
      })
      .catch((err) => console.log(err))
  }, [location.pathname, farmer?._id])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace
            size={30}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Overage Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <>
            <Input
              label="Farmer id"
              type="search"
              list="farmer_name"
              autoComplete="farmer"
              name="farmer"
              onChange={handleChange}
              value={state.farmer_id}
            />
            <datalist
              id="farmer_name"
              placeholder="enter farmer name"
              className="w-full">
              {farmers?.map((farmer, index) => {
                return (
                  <option
                    key={index}
                    className="w-full"
                    value={farmer.farmer_id}
                    children={farmer.first_name}
                  />
                )
              })}
            </datalist>
          </>
          {farmer && (
            <>
              <Input label="Farmer name" value={farmer?.first_name} />
              {disbursement?.map((dis) =>
                Number(dis?.overage) < 0 ? (
                  <Input label="Overage" value={dis.overage} name="overage" />
                ) : null
              )}
            </>
          )}

          <Input
            label="Account number"
            name="account"
            type="number"
            onChange={handleChange}
            value={state.account}
          />
          <Input
            label="Bank"
            name="bank"
            type="number"
            onChange={handleChange}
            value={state.bank}
          />
          <Input
            label="Amount to pay"
            name="amount"
            type="number"
            onChange={handleChange}
            value={state.amount}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={overageState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {overageState.isLoading ? "Loading..." : "submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OverageForm
