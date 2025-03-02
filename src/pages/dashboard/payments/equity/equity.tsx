import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"

import { useAppDispatch, useAppSelector } from "../../../../store"
import { fetchData } from "../../../../utils"
import { ICooperative } from "../../../../interfaces/cooperative"
import Input from "../../../../components/form/input"
import { IFarmer } from "../../../../interfaces/farmer"
import { toast } from "react-toastify"
import { IEquity } from "../../../../interfaces/equity"
import { equitySelector, reset } from "../../../../store/slices/finance/equity"
import {
  equityPaymentAction,
  updateEquityPaymentAction,
} from "../../../../store/actions/finance"
import { EquityContext } from "."

const initialState: IEquity = {
  amount_paid: undefined,
  amount_per_hectare: undefined,
  farmer: undefined,
  hectares: undefined,
}
const equityReducer = (prev: IEquity, next: IEquity) => ({
  ...prev,
  ...next,
})
const EquityPaymentForm = () => {
  const [state, setState] = useReducer(equityReducer, initialState)
  const [existingEquity, clearEquity] = useContext(EquityContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()

  const farmer = useMemo(
    () => farmers?.find((farmer) => farmer.farmer_id === state?.farmer),
    [state?.farmer]
  )
  // const inputRef = useRef<HTMLInputElement>(null)
  const equityState = useAppSelector(equitySelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setState({ ...state, [name]: value })
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    if (edit) {
      const { ...rest } = existingEquity
      dispatch(
        updateEquityPaymentAction(
          {
            ...state,
            amount_paid:
              (state?.amount_per_hectare ?? 0) * (state?.hectares ?? 0),
            farmer: rest.farmer?._id,
          },
          () => {
            toast.success(`Payment Updated!`)
            navigate(-1)
          }
        )
      )

      return
    }

    dispatch(
      equityPaymentAction(data, () => {
        toast.success(`Payment Successful!`)
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingEquity) {
      const { ...rest } = existingEquity
      setState({ ...rest, farmer: rest?.farmer?.farmer_id })
    }

    fetchData("/farmer")
      .then((res) => {
        if (res.data) setFarmerSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)
      clearEquity({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
      clearEquity({})
      dispatch(reset())
    }
    return () => {
      setState(initialState)
      clearEquity({})
      dispatch(reset())
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">
          Equity Payment Form
        </h4>
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
              value={state?.farmer}
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
                    children={
                      farmer?.first_name +
                      ` ${farmer?.other_name && farmer?.other_name} ` +
                      farmer?.last_name
                    }
                  />
                )
              })}
            </datalist>
          </>
          {farmer && (
            <>
              <Input
                label="Farmer name"
                value={farmer?.first_name + " " + farmer?.last_name}
              />
              <Input label="Phone number" value={farmer?.phone} />
              <Input
                label="Cooperative"
                value={(farmer?.cooperative as ICooperative).name}
              />
            </>
          )}

          <Input
            label="Hectares"
            name="hectares"
            type="number"
            onChange={handleChange}
            value={state.hectares}
          />
          <Input
            label="Amount Per Hectare"
            name="amount_per_hectare"
            type="number"
            onChange={handleChange}
            value={state.amount_per_hectare}
          />
          <Input
            label="Total Amount"
            name="amount_paid"
            type="number"
            value={(state?.amount_per_hectare ?? 0) * (state?.hectares ?? 0)}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={equityState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {equityState.isLoading
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

export default EquityPaymentForm
