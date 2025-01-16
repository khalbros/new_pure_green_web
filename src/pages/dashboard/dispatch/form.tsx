/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {Button} from "@material-tailwind/react"
import Input from "../../../components/form/input"
import {IDispatch} from "../../../interfaces/dispatch"
import {useAppDispatch, useAppSelector} from "../../../store"
import Select from "../../../components/form/select"
import {DispatchContext} from "."
import {dispatchSelector} from "../../../store/slices/dispatch"
import {
  createDispatchAction,
  updateDispatchAction,
} from "../../../store/actions/dispatch"
import {reset} from "../../../store/slices/dispatch"
import {fetchData, getUser} from "../../../utils"
import {IClient} from "../../../interfaces/client"
import {IWarehouse} from "../../../interfaces/warehouse"
import {IGrade} from "../../../interfaces/grade"
import useFetch from "../../../hooks/useFetch"
import {toast} from "react-toastify"

const initialState: IDispatch = {
  type: undefined,
  warehouse: undefined,
  client: undefined,
  item: undefined,
  grade: undefined,
  gross_weight: undefined,
  net_weight: undefined,
  num_bags: undefined,
}
const dispatchReducer = (prev: IDispatch, next: IDispatch) => ({
  ...prev,
  ...next,
})

const DispatchForm = () => {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const {data} = useFetch(`/dispatch/items/${user.warehouse?._id}`)
  const [state, setState] = useReducer(dispatchReducer, initialState)
  const [existingDispatch, clearInput] = useContext(DispatchContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [warehouse, setWarehouseSuggestion] = useState<IWarehouse[]>()
  const [grades, setGradeSuggestion] = useState<IGrade[]>()
  const [client, setClientSuggestion] = useState<IClient[]>()
  const [commodities, setCommoditySuggestion] = useState<
    {
      _id: string
      name: string
      quantity: number
      grade?: string
      type: string
    }[]
  >(data)
  const [commodity, setCommodity] = useState<{
    _id: string
    name: string
    quantity: number
    grade?: string
    type: string
  }>()
  const [gradeDeduction, setGradeDeduction] = useState<number>()
  // const inputRef = useRef<HTMLInputElement>(null)

  const dispatchState = useAppSelector(dispatchSelector)

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

    if (name === "item") {
      const comm = commodities?.find((com) => com._id === value)
      if (!comm) {
        setCommodity(comm)
        return
      }
      setCommodity(comm)
      return
    }
    if (name === "grade") {
      setGradeDeduction(
        grades?.find((grade) => grade._id === value)?.percentage
      )
      return
    }
    if (name === "gross_weight") {
      setState({
        ...state,
        [name]: value,
        net_weight: String(
          Number(value) - Number((Number(value) * Number(gradeDeduction)) / 100)
        ),
      })
    }
    return
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(state)
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.append("item_type", commodity?.type as string)

    console.log(data)

    if (edit) {
      dispatch(
        updateDispatchAction(state, () => {
          navigate(-1)
        })
      )
      return
    }

    dispatch(
      createDispatchAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingDispatch) {
      const {type, ...rest} = existingDispatch
      setState(rest)
    }
    fetchData("/client")
      .then((res) => {
        if (res.data) setClientSuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/warehouse")
      .then((res) => {
        if (res.data) setWarehouseSuggestion(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/grade")
      .then((res) => {
        if (res.data) setGradeSuggestion(res.data)
      })
      .catch((err) => toast.error(err))
    fetchData(`/dispatch/items/${user.warehouse?._id}`)
      .then((res) => {
        console.log(res.data)

        if (res.data) {
          const commodities = res.data.filter(
            (commodity: any) => commodity.quantity > 0
          )
          setCommoditySuggestion(commodities)
        }
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
            size={30}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Dispatch Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <Select
            name="type"
            label="Dispatch type"
            placeholder=""
            inputContainerStyle=""
            onChange={handleChange}
            value={state?.type}>
            <option selected>Select dispatch type</option>
            <option
              value={"Inter warehouse"}
              selected={state.type === "Inter warehouse"}>
              Inter Warehouse
            </option>
            <option value={"Trading"} selected={state.type === "Trading"}>
              Trading
            </option>
          </Select>

          {state.type === "Inter warehouse" ? (
            <Select
              name="warehouse"
              label="Warehouse"
              placeholder=""
              inputContainerStyle=""
              onChange={handleChange}
              value={state?.warehouse}>
              <option selected>Select warehouse</option>
              {warehouse?.map((warehouse, index) => {
                return (
                  <option key={index} className="w-full" value={warehouse._id}>
                    {warehouse.name}
                  </option>
                )
              })}
            </Select>
          ) : state.type === "Trading" ? (
            <>
              <Input
                label="client"
                type="search"
                list="client_list"
                autoComplete="client_list"
                name="client"
                onChange={handleChange}
                value={state.client}
              />
              <datalist
                id="client_list"
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
          ) : (
            <Input label="Warehouse / Client" disabled />
          )}
          <Select
            name="item"
            label="Item"
            placeholder=""
            className="flex justify-between"
            onChange={handleChange}
            value={state?.item}>
            <option selected>Select Item</option>

            {commodities?.map((commodity, index) => {
              return (
                <option
                  key={index}
                  value={commodity?._id}
                  className="flex p-5 justify-between">
                  <span>{commodity?.name}</span>
                </option>
              )
            })}
          </Select>
          {commodity?.type === "commodity" && (
            <>
              <Select
                name="grade"
                label="Grade"
                placeholder=""
                className="flex justify-between"
                onChange={handleChange}
                value={state?.grade}>
                <option selected>Select Grade</option>

                {grades?.map((grade, index) => {
                  return (
                    <option
                      key={index}
                      value={grade._id}
                      className="flex p-5 justify-between">
                      <span>{grade?.name}</span>
                    </option>
                  )
                })}
              </Select>
              <Input
                label="Gross weight"
                name="gross_weight"
                onChange={handleChange}
                value={state.gross_weight}
              />
              <Input
                label="Net weight"
                name="net_weight"
                onChange={handleChange}
                value={state.net_weight}
              />
            </>
          )}
          <Input
            label={`Number of bags (${
              commodity?.quantity ? commodity?.quantity : 0
            }) available`}
            type="number"
            name="num_bags"
            onChange={handleChange}
            value={state.num_bags}
          />
          <Input
            label="Driver's name"
            name="driver"
            onChange={handleChange}
            value={state.driver}
          />
          <Input
            label="Truck's number"
            name="truck_num"
            onChange={handleChange}
            value={state.truck_num}
          />
          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={dispatchState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {dispatchState.isLoading
                ? "Loading..."
                : edit
                ? "Update Dispatch"
                : "Post Dispatch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DispatchForm
