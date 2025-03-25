import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { MdCancel, MdOutlineKeyboardBackspace } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { useAppDispatch, useAppSelector } from "../../../../store"
import { disbursementSelector } from "../../../../store/slices/disbursement"
import {
  repaymentDisbursementAction,
  updateDisbursementAction,
} from "../../../../store/actions/disbursement"
import { reset } from "../../../../store/slices/disbursement"
import { fetchData } from "../../../../utils"
import { IBundle } from "../../../../interfaces/bundle"
import Input from "../../../../components/form/input"
import { IFarmer } from "../../../../interfaces/farmer"
import React from "react"
import { ICommodity } from "../../../../interfaces/commodity"
import { IGrade } from "../../../../interfaces/grade"
import Select from "../../../../components/form/select"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import Receipt from "./receipt"
import { IGrainFormData } from "../../../../interfaces/grainLRP"

const initialState: IGrainFormData = {
  commodities: [
    {
      commodity: "",
      gross_weight: undefined,
      net_weight: undefined,
      quantity: undefined,
    },
  ],
}
const disbursementReducer = (prev: IGrainFormData, next: IGrainFormData) => ({
  ...prev,
  ...next,
})

const DisbursementRepaymentForm = () => {
  const [state, setState] = useReducer(disbursementReducer, initialState)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()
  const [disbursements, setDisbursementSuggestion] = useState<IDisbursement[]>()
  const [commoditySuggestion, setCommoditySuggestion] = useState<ICommodity[]>()
  const [gradeSuggestion, setGradeSuggestion] = useState<IGrade[]>()
  const [selectedCommodity, setSelectedCommodity] = useState<ICommodity>()
  const [selectedGrade, setSelectedGrade] = useState<IGrade>()
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
  // const togglePrint = (disbursement?: IDisbursement) => {
  //   if (disbursement) {
  //     setOpen(!open)
  //   }
  // navigate(-1)
  // }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
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
    setState({ ...state, [name]: value })
    return
  }

  const handleCommodityChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target
    const commoditySelected = commoditySuggestion?.find(
      (con) => con._id === value
    )
    const gradeSelected = gradeSuggestion?.find((con) => con._id === value)

    if (name === "commodity") {
      setSelectedCommodity(commoditySelected)
    }
    if (name === "grade") {
      setSelectedGrade(gradeSelected)
    }
    if (name === "gross_weight") {
      setState({
        ...state,
        commodities: state.commodities?.map((commodity, i) =>
          i === index
            ? {
                ...commodity,
                [name]: Number(value),
                net_weight: Number(
                  Number(value) -
                    Number(
                      (Number(selectedGrade?.percentage) / 100) * Number(value)
                    )
                ),
                pp: Number(selectedCommodity?.price?.loan),
              }
            : commodity
        ),
      })
      return
    }

    setState({
      ...state,
      commodities: state.commodities?.map((commodity, i) =>
        i === index
          ? {
              ...commodity,
              [name]: value,
            }
          : commodity
      ),
    })
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.delete("commodity")
    data.delete("quantity")
    data.delete("pp")
    data.append("equity", String(disbursement?.equity))
    data.set(
      "farmer",
      String(farmers?.find((f) => f.farmer_id === state?.farmer)?._id)
    )

    if (edit) {
      dispatch(
        updateDisbursementAction(state, () => {
          navigate(-1)
        })
      )
      return
    }

    // const formData = Object.fromEntries(data)

    dispatch(
      repaymentDisbursementAction(data, () => {
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
        console.log(res)

        if (res.data) setDisbursementSuggestion(res.data)
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

      dispatch(reset())
    }
  }, [])

  function calPayebleAmmount() {
    const net = state?.commodities?.reduce(
      (total, commodity) => total + Number(commodity.net_weight),
      0
    )
    const price = state?.commodities?.reduce(
      (total, commodity) => total + Number(commodity?.pp),
      0
    )
    payableAmount =
      Number(price) * Number(net) -
      Number(1 * Number(net)) +
      Number(state?.processing_fee ?? 0) -
      Number(state?.logistics_fee ?? 0)

    outstanding_loan = Number(disbursement?.outstanding_loan) - payableAmount

    overage = payableAmount - Number(disbursement?.outstanding_loan)
    return { payableAmount, outstanding_loan, overage }
  }

  useEffect(() => {
    // if (disbursementState.data) {
    //   togglePrint(disbursementState.data)
    // }
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
            value={"Grains"}
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
                  children={farmer.first_name}
                />
              )
            })}
          </datalist>

          {disbursement ? (
            <>
              <Input
                label="Farmer name"
                value={(disbursement.farmer as IFarmer)?.first_name}
                readOnly
              />
              <Input
                label="Bundle"
                value={(disbursement.bundle as IBundle)?.name}
                readOnly
              />
              <Input label="Hectares" value={disbursement.hectares} readOnly />
              <Input label="Equity" value={disbursement.equity} readOnly />
              <Input
                label="Total loan amount"
                value={disbursement.loan_amount}
                readOnly
              />
              <Input
                label="Repayment amount"
                value={disbursement.outstanding_loan}
                readOnly
              />
              {/* // if repayment type is grains */}
              <>
                {state.commodities?.map((commodity, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-1 items-center gap-4">
                      <Select
                        name="commodity"
                        label={"Commodity"}
                        placeholder=""
                        className="flex justify-between w-full"
                        inputContainerStyle="w-full"
                        onChange={(e) => handleCommodityChange(e, index)}
                        value={commodity?.commodity}>
                        <option>Select commodity</option>
                        {commoditySuggestion?.map((commodity, index) => {
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
                        label={"Grade"}
                        placeholder=""
                        className="flex justify-between w-full"
                        inputContainerStyle="w-full"
                        onChange={(e) => handleCommodityChange(e, index)}
                        value={commodity?.grade}>
                        <option>Select Grade</option>
                        {gradeSuggestion?.map((grade, index) => {
                          return (
                            <option
                              key={index}
                              value={grade._id}
                              className="flex p-5 justify-between">
                              <span>{grade.name}</span>
                            </option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="hidden">
                      <input
                        type="text"
                        name="commodities"
                        value={JSON.stringify(state?.commodities)}
                        readOnly
                      />
                    </div>

                    <div
                      key={index}
                      className="flex flex-1 items-center gap-4 lg:gap-y-6">
                      <Input
                        name="quantity"
                        label={"Quantity"}
                        placeholder="0"
                        inputContainerStyle="w-full"
                        onChange={(e) => handleCommodityChange(e, index)}
                        value={commodity.quantity}
                      />
                      <Input
                        name="gross_weight"
                        label="Gross weight"
                        type="text"
                        placeholder="0"
                        inputContainerStyle="w-full"
                        onChange={(e) => handleCommodityChange(e, index)}
                        value={commodity?.gross_weight}
                      />
                      <Input
                        name="net_weight"
                        label="Net weight"
                        type="number"
                        placeholder="0"
                        inputContainerStyle="w-full"
                        onChange={(e) => handleCommodityChange(e, index)}
                        value={commodity.net_weight?.toFixed(2)}
                        readOnly
                      />
                      {(state.commodities?.length as number) > 1 && (
                        <div>
                          <MdCancel
                            className="text-3xl lg:text-3xl rounded-full bg-white text-red-600"
                            onClick={() =>
                              setState({
                                ...state,
                                commodities: state.commodities?.filter(
                                  (_commodity, i) => i !== index
                                ),
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
                <Button
                  color="light-green"
                  className="w-[40%] lg:w-full self-end lg:col-start-2"
                  onClick={() =>
                    setState({
                      ...state,
                      commodities: [
                        ...state.commodities!,
                        {
                          commodity: "",
                          quantity: undefined,
                          gross_weight: undefined,
                          net_weight: undefined,
                        },
                      ],
                    })
                  }>
                  add commodity
                </Button>

                <Input
                  name="num_bags"
                  label="Number of bags"
                  type="number"
                  placeholder="0"
                  inputContainerStyle="w-full"
                  onChange={handleChange}
                  value={state?.commodities?.reduce(
                    (total, commodity) => total + Number(commodity.quantity),
                    0
                  )}
                  readOnly
                />
                <Input
                  name="gross_weight"
                  label="Gross weight"
                  type="number"
                  placeholder="0"
                  inputContainerStyle="w-full"
                  onChange={handleChange}
                  value={state?.commodities?.reduce(
                    (total, commodity) =>
                      total + Number(commodity.gross_weight),
                    0
                  )}
                  readOnly
                />
                <Input
                  name="net_weight"
                  label="Net weight"
                  type="number"
                  placeholder="0"
                  inputContainerStyle="w-full"
                  onChange={handleChange}
                  readOnly
                  value={state?.commodities
                    ?.reduce(
                      (total, commodity) =>
                        total + Number(commodity.net_weight),
                      0
                    )
                    .toFixed(2)}
                />
              </>
              <Input
                name="overage"
                label="Overage"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={(calPayebleAmmount()?.overage > 0
                  ? calPayebleAmmount()?.overage
                  : 0
                )?.toFixed(2)}
                readOnly
              />
              <Input
                name="outstanding_loan"
                label="Outstanding loan"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={(calPayebleAmmount()?.outstanding_loan > 0
                  ? calPayebleAmmount()?.outstanding_loan
                  : 0
                )?.toFixed(2)}
                readOnly
              />
              <Input
                name="logistics_fee"
                label="Logistics fee"
                type="text"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={state?.logistics_fee}
              />
              <Input
                name="processing_fee"
                label="Processing fee"
                type="text"
                inputContainerStyle="w-full"
                onChange={handleChange}
                value={state?.processing_fee}
              />
              <Input
                name="payable_amount"
                label="Payable amount"
                type="number"
                placeholder="0"
                inputContainerStyle="w-full"
                readOnly
                onChange={handleChange}
                value={calPayebleAmmount()?.payableAmount.toFixed(2)}
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
          ) : !disbursement && !farmerFound && state?.farmer ? (
            <span className="text-red-500 capitalize">
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

export default DisbursementRepaymentForm
