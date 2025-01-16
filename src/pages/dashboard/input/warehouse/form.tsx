/* eslint-disable @typescript-eslint/no-unused-vars */
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
import Input from "../../../../components/form/input"
import { IWInput } from "../../../../interfaces/input"
import { useAppDispatch } from "../../../../store"
import Select from "../../../../components/form/select"
import { InputContext } from "../"
import { reset } from "../../../../store/slices/input"
import {
  addWarehouseInputAction,
  updateWarehouseInputAction,
} from "../../../../store/actions/input"
import { fetchData } from "../../../../utils"
import { useQuery, useQueryClient } from "react-query"

const initialState: IWInput = {
  input: undefined,
  warehouse: undefined,
  quantity: undefined,
}
const inputReducer = (prev: IWInput, next: IWInput) => ({
  ...prev,
  ...next,
})

const WarehouseInputForm = () => {
  const [state, setState] = useReducer(inputReducer, initialState)
  const [existingInput, clearInput] = useContext(InputContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const { data: inputs, isLoading } = useQuery({
    queryKey: ["inputs", "name"],
    queryFn: async () => {
      return fetchData("/input/isapproved").then((res) => res.data)
    },
  })

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

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
        updateWarehouseInputAction(state, () => {
          queryClient.invalidateQueries("inputs", { exact: true })
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      addWarehouseInputAction(data, () => {
        queryClient.invalidateQueries("inputs", { exact: true })
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingInput) {
      const { password, ...rest } = existingInput
      setState(rest)
    }
    return () => {
      // setState(initialState)
      clearInput({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
    console.log(state)
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">Input Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <>
            <Select
              name="input"
              label={"Name"}
              placeholder="Urea"
              className=""
              onChange={handleChange}
              value={state.input?.name?.trim()}>
              <option> {isLoading ? "Loading..." : "Select input"}</option>
              {(inputs as { name: string; _id: string; code: string }[])?.map(
                (input, index) => {
                  return (
                    <option key={index} value={input._id}>
                      {input?.name}
                    </option>
                  )
                }
              )}
            </Select>
            <Input
              type="number"
              name="quantity"
              label="Quantity"
              placeholder="0"
              onChange={handleChange}
              value={state?.quantity}
            />
          </>

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              //   disabled={signUpState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WarehouseInputForm
