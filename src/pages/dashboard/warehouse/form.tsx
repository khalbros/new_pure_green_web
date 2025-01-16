/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import Input from "../../../components/form/input"
import { IWarehouse } from "../../../interfaces/warehouse"
import { useAppDispatch, useAppSelector } from "../../../store"
import { warehouseSelector, reset } from "../../../store/slices/warehouse"
import {
  createWarehouseAction,
  updateWarehouseAction,
} from "../../../store/actions/warehouse"
import { WarehouseContext } from "./"

const initialState: IWarehouse = {
  name: undefined,
  capacity: undefined,
  state: undefined,
  lga: undefined,
  address: undefined,
}

const warehouseReducer = (prev: IWarehouse, next: IWarehouse) => ({
  ...prev,
  ...next,
})

const WarehouseForm = () => {
  const [state, setState] = useReducer(warehouseReducer, initialState)
  const [existingWarehouse, clearWarehouse] = useContext(WarehouseContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const warehouseState = useAppSelector(warehouseSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    if (edit) {
      dispatch(
        updateWarehouseAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createWarehouseAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingWarehouse) {
      const { ...rest } = existingWarehouse
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearWarehouse({})
      dispatch(reset())
    }
  }, [clearWarehouse, dispatch])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">Warehouse Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16"
        >
          <Input
            name="name"
            label="Warehouse name"
            inputContainerStyle="col-span-2 w-full"
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />

          <Input
            name="capacity"
            type="text"
            label="Warehouse capacity*"
            placeholder=""
            onChange={handleChange}
            value={state?.capacity}
          />
          <Input
            name="state"
            label="State*"
            placeholder=""
            value={state?.state}
            onChange={handleChange}
          />
          <Input
            name="lga"
            label="Local govt.*"
            placeholder=""
            value={state?.lga}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address*"
            placeholder=""
            value={state?.address}
            onChange={handleChange}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={warehouseState.isLoading}
              className="w-[70%] bg-green-600 py-3 tracking-wider text-base md:text-lg"
            >
              {edit ? "Update Warehouse" : "Create Warehouse"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WarehouseForm
