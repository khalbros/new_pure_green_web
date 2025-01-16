import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import {MdOutlineKeyboardBackspace} from "react-icons/md"
import {useLocation, useNavigate} from "react-router-dom"
import {Button} from "@material-tailwind/react"
import Input from "../../../components/form/input"
import {ICommodity} from "../../../interfaces/commodity"
import {useAppDispatch, useAppSelector} from "../../../store"
import {CommodityContext} from "."
import {commoditySelector} from "../../../store/slices/commodity"
import {
  createCommodityAction,
  updateCommodityAction,
} from "../../../store/actions/commodity"
import {reset} from "../../../store/slices/commodity"

const initialState: ICommodity = {
  name: undefined,
  price: undefined,
}
const commodityReducer = (prev: ICommodity, next: ICommodity) => ({
  ...prev,
  ...next,
})

const CommodityForm = () => {
  const [state, setState] = useReducer(commodityReducer, initialState)
  const [existingCommodity, clearCommodity] = useContext(CommodityContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const commodityState = useAppSelector(commoditySelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target
    if (name === "loan" || name === "trade" || name === "storage") {
      setState({...state, price: {...state.price, [name]: Number(value)}})
    } else {
      setState({...state, [name]: value})
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.set("price", JSON.stringify(state?.price))

    if (edit) {
      dispatch(
        updateCommodityAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createCommodityAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingCommodity) {
      const {...rest} = existingCommodity
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearCommodity({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    return () => {
      if (location.pathname.includes("/add")) {
        setState(initialState)
      }
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace
            size={30}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Commodity Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="name"
            label="Name"
            inputContainerStyle=""
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />

          <React.Fragment>
            <div className="flex flex-1 items-center gap-4 lg:gap-y-6">
              <Input
                name="loan"
                label={"Loan"}
                placeholder={Number(0).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
                inputContainerStyle="w-full"
                onChange={(e) => handleChange(e)}
                value={state?.price?.loan}
              />
              <Input
                name="trade"
                label={"Trade"}
                type="number"
                placeholder={Number(0).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
                inputContainerStyle="w-full"
                onChange={(e) => handleChange(e)}
                value={state?.price?.trade}
              />
              <Input
                name="storage"
                label={"Storage"}
                type="number"
                placeholder={Number(0).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
                inputContainerStyle="w-full"
                onChange={(e) => handleChange(e)}
                value={state?.price?.storage}
              />
            </div>
          </React.Fragment>

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={commodityState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommodityForm
