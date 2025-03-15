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
import Input from "../../../../components/form/input"
import { ICooperative } from "../../../../interfaces/cooperative"
import { toast } from "react-toastify"
import { ICertificate } from "../../../../interfaces/certificate"
import {
  certificateSelector,
  reset,
} from "../../../../store/slices/finance/certificate"
import {
  certPaymentAction,
  updateCertPaymentAction,
} from "../../../../store/actions/finance"
import { CertContext } from "."
import { IWarehouse } from "../../../../interfaces/warehouse"

const initialState: ICertificate = {
  amount_paid: undefined,
  cooperative: undefined,
  warehouse: undefined,
}
const certificateReducer = (prev: ICertificate, next: ICertificate) => ({
  ...prev,
  ...next,
})
const CertificatePaymentForm = () => {
  const [state, setState] = useReducer(certificateReducer, initialState)
  const [existingCertificate, clearCertificate] = useContext(CertContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [cooperativies, setCooperativeSuggestion] = useState<ICooperative[]>()

  const cooperative = useMemo(
    () =>
      cooperativies?.find(
        (cooperative) => cooperative.name === state?.cooperative
      ),
    [state?.cooperative]
  )
  // const inputRef = useRef<HTMLInputElement>(null)
  const certificateState = useAppSelector(certificateSelector)

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
      const { ...rest } = existingCertificate
      dispatch(
        updateCertPaymentAction(
          {
            ...state,
            amount_paid: state?.amount_paid ?? 0,
            cooperative: rest.cooperative?._id,
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
      certPaymentAction(data, () => {
        toast.success(`Payment Successful!`)
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingCertificate) {
      const { ...rest } = existingCertificate
      setState({ ...rest, cooperative: rest?.cooperative?.cooperative_id })
    }

    fetchData("/cooperative")
      .then((res) => {
        if (res.data) setCooperativeSuggestion(res.data)
      })
      .catch((err) => console.log(err))

    return () => {
      setState(initialState)
      clearCertificate({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
      clearCertificate({})
      dispatch(reset())
    }
    return () => {
      setState(initialState)
      clearCertificate({})
      dispatch(reset())
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">
          Certificate Payment Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <>
            <Input
              label="Cooperative"
              type="search"
              list="cooperative_name"
              autoComplete="cooperative"
              name="cooperative"
              onChange={handleChange}
              value={state?.cooperative}
            />
            <datalist
              id="cooperative_name"
              placeholder="enter cooperative name"
              className="w-full">
              {cooperativies?.map((cooperative, index) => {
                return (
                  <option
                    key={index}
                    className="w-full"
                    value={cooperative.name}
                    children={cooperative?.name}
                  />
                )
              })}
            </datalist>
          </>
          {cooperative && (
            <>
              <Input
                label="Cooperative Chairman"
                value={cooperative?.chairman}
              />
              <Input label="Phone number" value={cooperative?.phone} />
              <Input
                label="Warehouse"
                value={(cooperative?.warehouse as IWarehouse).name}
              />
            </>
          )}

          <Input
            label="Total Amount"
            name="amount_paid"
            type="number"
            onChange={handleChange}
            value={state?.amount_paid}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={certificateState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {certificateState.isLoading
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

export default CertificatePaymentForm
