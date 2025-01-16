import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import {MdCancel, MdOutlineKeyboardBackspace} from "react-icons/md"
import {useLocation, useNavigate} from "react-router-dom"
import {Button, Dialog, DialogBody} from "@material-tailwind/react"
import {IDisbursement} from "../../../../interfaces/disbursement"
import {useAppDispatch, useAppSelector} from "../../../../store"
import {disbursementSelector} from "../../../../store/slices/disbursement"
import {
  cashLRPAction,
  updateCashLRPAction,
} from "../../../../store/actions/disbursement"
import {reset} from "../../../../store/slices/disbursement"
import {fetchData} from "../../../../utils"
import {IBundle} from "../../../../interfaces/bundle"
import Input from "../../../../components/form/input"
import {IFarmer} from "../../../../interfaces/farmer"
import {useRef} from "react"
import {useReactToPrint} from "react-to-print"
import Receipt from "./receipt"
import {ICashFormdata} from "../../../../interfaces/cashLRP"

const initialState: ICashFormdata = {
  cash_paid: 0,
}
const disbursementReducer = (prev: ICashFormdata, next: ICashFormdata) => ({
  ...prev,
  ...next,
})

const CashRepaymentForm = () => {
  const [state, setState] = useReducer(disbursementReducer, initialState)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()
  const [disbursements, setDisbursementSuggestion] = useState<IDisbursement[]>()
  const [farmerFound, setFarmerFound] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(false)

  const disbursement = useMemo(
    () =>
      disbursements?.find((disburse) => {
        setFarmerFound(true)
        return (
          (disburse.farmer as IFarmer)?.farmer_id === state.farmer &&
          disburse.status !== "PAID" &&
          disburse.isApproved
        )
      }),
    [state.farmer]
  )
  // const inputRef = useRef<HTMLInputElement>(null)
  const disbursementState = useAppSelector(disbursementSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  let payableAmount = 0
  let overage = 0
  let outstanding_loan = 0

  // printing handlers
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint() {
      setOpen(false)
      navigate(-1)
    },
  })
  const togglePrint = (disbursement?: IDisbursement) => {
    if (disbursement) {
      setOpen(!open)
    }
    // navigate(-1)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target
    if (name === "processing_fee" || name === "logistics_fee") {
      if (outstanding_loan < 0) {
        overage = payableAmount + Number(value)
        setState({
          ...state,
          [name]: Number(value),
          overage: payableAmount + Number(value),
        })
        return
      }

      payableAmount = payableAmount - Number(value)
      setState({
        ...state,
        [name]: Number(value),
        payable_amount: payableAmount - Number(value),
      })
      return
    }
    setState({...state, [name]: value})
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    data.delete("farmer")
    data.append("disbursement", disbursement?._id as string)

    if (edit) {
      dispatch(
        updateCashLRPAction(state, () => {
          navigate(-1)
        })
      )
      return
    }

    // const formData = Object.fromEntries(data)
    // console.log(formData)

    dispatch(
      cashLRPAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  function handleSearch() {
    if (disbursement) {
      setFarmerFound(true)
    } else {
      if (state.farmer) {
        setFarmerFound(false)
      }
    }
  }

  useEffect(() => {
    fetchData("/farmer")
      .then((res) => {
        if (res.data) setFarmerSuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/disbursement")
      .then((res) => {
        if (res.data) setDisbursementSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)
      dispatch(reset())
    }
  }, [])

  function calPayebleAmmount() {
    payableAmount =
      Number(state?.cash_paid) -
      Number(state?.processing_fee ?? 0) -
      Number(state?.logistics_fee ?? 0)
    outstanding_loan = Number(disbursement?.outstanding_loan) - payableAmount
    overage = payableAmount - Number(disbursement?.outstanding_loan)
    return {payableAmount, outstanding_loan, overage}
  }

  useEffect(() => {
    if (disbursementState.data) {
      togglePrint(disbursementState.data)
    }
    return () => {
      dispatch(reset())
    }
  }, [disbursementState.data, dispatch])

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
          Loan Repayment Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <Input
            name="repayment_type"
            label={"Repayment Type"}
            readOnly
            value={"Cash"}
          />
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
                  children={farmer.name}
                />
              )
            })}
          </datalist>

          {(disbursement && disbursement?.status === "NOT PAID") || edit ? (
            <>
              <Input
                label="Farmer name"
                value={(disbursement?.farmer as IFarmer)?.name}
                readOnly
              />
              <Input
                label="Bundle"
                value={(disbursement?.bundle as IBundle)?.name}
                readOnly
              />
              <Input label="Hectares" value={disbursement?.hectares} readOnly />
              <Input label="Equity" value={disbursement?.equity} readOnly />
              <Input
                label="Total loan amount"
                value={disbursement?.loan_amount}
                readOnly
              />
              <Input
                label="Repayment amount"
                value={disbursement?.outstanding_loan?.toFixed()}
                readOnly
              />

              <Input
                name="overage"
                label="Overage"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={(calPayebleAmmount().overage > 0
                  ? calPayebleAmmount().overage
                  : 0
                ).toFixed()}
                readOnly
              />
              <Input
                name="outstanding_loan"
                label="Outstanding loan"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={(calPayebleAmmount().outstanding_loan > 0
                  ? calPayebleAmmount().outstanding_loan
                  : 0
                ).toFixed()}
                readOnly
              />

              <Input
                name="logistics_fee"
                label="Logistics fee"
                type="number"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={state?.logistics_fee}
              />
              <Input
                name="processing_fee"
                label="Processing fee"
                type="number"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={state?.processing_fee}
              />
              <Input
                name="cash_paid"
                label="Cash"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={state?.cash_paid}
              />
              <Input
                name="payable_amount"
                label="Payable amount"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                readOnly
                onChange={handleChange}
                value={calPayebleAmmount().payableAmount.toFixed()}
              />
              <div className="col-span-2 my-8 text-center">
                <Button
                  type="submit"
                  disabled={disbursementState.isLoading}
                  className="w-[70%] bg-green-600 py-3">
                  {disbursementState.isLoading
                    ? "Loading..."
                    : edit
                    ? "Update"
                    : "Submit"}
                </Button>
              </div>
            </>
          ) : disbursement && disbursement?.status === "PAID" ? (
            <span className="text-green-700 capitalize font-bold tracking-wide">
              Loan Already Paid!
            </span>
          ) : !disbursement && !farmerFound && state?.farmer ? (
            <span className="text-red-500 capitalize font-bold tracking-wide">
              No disburse found for this farmer
            </span>
          ) : (
            <div className="col-span-2 my-8 text-center">
              <Button
                disabled={disbursementState.isLoading}
                className="w-[70%] bg-green-600 py-3"
                onClick={handleSearch}>
                {disbursementState.isLoading ? "Loading..." : "Search"}
              </Button>
            </div>
          )}
        </form>
        {/* RECEIPT */}
        <Dialog size="sm" open={open} handler={() => setOpen(!open)}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => setOpen(!open)}
              />{" "}
            </div>
            <div ref={componentRef}>
              <Receipt {...disbursement} />
            </div>
            <Button
              onClick={handlePrint}
              className="bg-green-600 w-60p mx-auto block my-10">
              Print
            </Button>
          </DialogBody>
        </Dialog>
      </div>
    </div>
  )
}

export default CashRepaymentForm
