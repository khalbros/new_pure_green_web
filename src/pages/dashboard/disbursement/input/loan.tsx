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
import { Button, Chip } from "@material-tailwind/react"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { useAppDispatch, useAppSelector } from "../../../../store"
import Select from "../../../../components/form/select"
import { disbursementSelector } from "../../../../store/slices/disbursement"
import {
  loanDisbursementAction,
  updateDisbursementAction,
} from "../../../../store/actions/disbursement"
import { reset } from "../../../../store/slices/disbursement"
import { fetchData } from "../../../../utils"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IBundle } from "../../../../interfaces/bundle"
import Input from "../../../../components/form/input"
import { IFarmer } from "../../../../interfaces/farmer"
import { toast } from "react-toastify"

import { DisbursementContext } from "."
import { IEquity } from "../../../../interfaces/equity"

const initialState: IDisbursement = {}
const disbursementReducer = (prev: IDisbursement, next: IDisbursement) => ({
  ...prev,
  ...next,
})

const DisbursementLoanForm = () => {
  const [state, setState] = useReducer(disbursementReducer, initialState)
  const [existingbursement, clearDisbursement] = useContext(DisbursementContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()
  const [bundle, setBundleSuggestion] = useState<IBundle[]>()
  const [selectedBundle, setSelectedBundle] = useState<IBundle>()
  const [farmerEquity, setFarmerEquity] = useState<IEquity>()
  const [isValidHectare, setIsValidHectare] = useState<boolean>(false)
  const farmer = useMemo(
    () => farmers?.find((farmer) => farmer.farmer_id === state.farmer),
    [state.farmer]
  )

  // const inputRef = useRef<HTMLInputElement>(null)
  const disbursementState = useAppSelector(disbursementSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setState({ ...state, [name]: value })
    if (name === "bundle") {
      setSelectedBundle(bundle?.find((b) => b._id === value))
    }

    if (name === "hectares") {
      setIsValidHectare(() =>
        Number(value) > (farmerEquity?.hectares as number) ? false : true
      )
      if (Number(value) > (farmerEquity?.hectares as number)) {
        toast.error(
          `sorry you can't book more then ${farmerEquity?.hectares} hectares for this farmer`
        )
      }
    }

    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    if (edit) {
      dispatch(
        updateDisbursementAction(state, () => {
          toast.success(`Disburse Updated!`)
          navigate(-1)
        })
      )
      return
    }

    dispatch(
      loanDisbursementAction(data, () => {
        toast.success(`Loan Disbursed!`)
        navigate(-1)
      })
    )
    return
  }

  function cals() {
    const equity = Number(
      Number(farmerEquity?.amount_per_hectare ?? 0) *
        Number(state?.hectares ?? 0)
    )

    const totalLoan =
      selectedBundle && Number(selectedBundle.total) * Number(state?.hectares)
    const repayment =
      Number(selectedBundle?.total) * Number(state?.hectares) - Number(equity)

    return { equity, totalLoan, repayment }
  }

  useEffect(() => {
    fetchData("/farmer")
      .then((res) => {
        if (res.data) setFarmerSuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/bundle")
      .then((res) => {
        if (res.data) setBundleSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    if (existingbursement) {
      const { ...rest } = existingbursement
      setState(rest)
    }
    return () => {
      setState(initialState)
      clearDisbursement({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    fetchData(`/payment/all/equity?farmer=${farmer?._id}`)
      .then((res) => {
        if (res.data)
          setFarmerEquity(
            res.data.find((equity: IEquity) => equity.status === "PAID")
          )
      })
      .catch((err) => console.log(err))
    return () => {
      setFarmerEquity(undefined)
    }
  }, [state.farmer])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500 uppercase">
          Input Loan Disbursement Form
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
              value={
                edit ? (state?.farmer as IFarmer)?.farmer_id : state.farmer
              }
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
                    children={`${farmer?.first_name} ${
                      farmer?.other_name ?? ""
                    } ${farmer?.last_name}`}
                  />
                )
              })}
            </datalist>
          </>
          {farmer ? (
            farmerEquity ? (
              <>
                <Input label="Farmer name" value={farmer?.first_name} />
                <Input label="Phone number" value={farmer?.phone} />
                <Input
                  label="Cooperative"
                  value={(farmer?.cooperative as ICooperative).name}
                />
                <Input
                  label="Cooperative chairman"
                  value={(farmer?.cooperative as ICooperative).chairman}
                />

                <div>
                  <Select
                    name="bundle"
                    label="Bundle"
                    placeholder=""
                    inputContainerStyle=""
                    onChange={handleChange}
                    value={state?.bundle}>
                    <option>Select bundle</option>
                    {bundle?.map((bundle, index) => {
                      return (
                        <option key={index} value={bundle._id}>
                          {bundle.name}
                        </option>
                      )
                    })}
                  </Select>
                  {selectedBundle && (
                    <div className="flex flex-wrap w-full gap-2 mt-4">
                      {selectedBundle?.inputs?.map((input, index) => (
                        <Chip
                          value={`${input.input}  ( ${input.quantity} )`}
                          className="w-fit text-sm md:text-base"
                          key={index}
                          color="light-green"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  label="Hectares"
                  name="hectares"
                  type="number"
                  onChange={handleChange}
                  value={state.hectares}
                  className={`${
                    !isValidHectare ? "text-red-600 font-bold text-lg" : ""
                  } `}
                />
                <Input
                  label="Equity"
                  name="equity"
                  type="number"
                  onChange={handleChange}
                  readOnly
                  value={cals().equity}
                />
                <Input
                  label="Total loan amount"
                  name="loan_amount"
                  type="number"
                  readOnly
                  onChange={handleChange}
                  value={cals().totalLoan}
                />
                <Input
                  label="Repayment Amount"
                  name="repayment_amount"
                  type="number"
                  readOnly
                  onChange={handleChange}
                  value={cals().repayment}
                />
              </>
            ) : (
              <div className=" flex items-end">
                <span className="text-red-500 text-center font-bold text-lg">
                  No equity paid by this farmer
                </span>
              </div>
            )
          ) : (
            <></>
          )}

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={disbursementState.isLoading || !isValidHectare}
              className="w-[70%] bg-green-600 py-3">
              {disbursementState.isLoading
                ? "Loading..."
                : edit
                ? "Update Disbursement"
                : "submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DisbursementLoanForm
