/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { MdCancel, MdOutlineKeyboardBackspace } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import Input from "../../../components/form/input"
import { IBundle } from "../../../interfaces/bundle"
import Select from "../../../components/form/select"
import { useAppDispatch, useAppSelector } from "../../../store"
import { BundleContext } from "."
import { bundleSelector } from "../../../store/slices/bundle"
import {
  createBundleAction,
  updateBundleAction,
} from "../../../store/actions/bundle"
import { reset } from "../../../store/slices/warehouse"
import { fetchData } from "../../../utils"
import { toast } from "react-toastify"
import useFetch from "../../../hooks/useFetch"
import { IInput } from "../../../interfaces/input"

const initialState: IBundle = {
  name: undefined,
  inputs: [{ input: "", quantity: "" }],
  total: undefined,
}

const inputFields: { input: string; quantity: string }[] = [
  { input: "", quantity: "" },
]

const bundleReducer = (prev: IBundle, next: IBundle) => ({
  ...prev,
  ...next,
})

const BundleForm = () => {
  const { data } = useFetch("/input/isapproved")
  const [state, setState] = useReducer(bundleReducer, initialState)
  const [existingBundle, clearBundle] = useContext(BundleContext)

  const [inputs, setInputs] = useState<string[]>(
    data?.map((input: IInput) => input.name)
  )
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const bundleState = useAppSelector(bundleSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setState({ ...state, [name]: value })
  }
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target

    setState({
      ...state,
      inputs: state.inputs?.map((input, i) =>
        i === index ? { ...input, [name]: value } : input
      ),
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.delete("input")
    data.delete("quantity")

    if (edit) {
      dispatch(
        updateBundleAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createBundleAction(data, () => {
        navigate(-1)
      })
    )

    return
  }

  useEffect(() => {
    if (existingBundle) {
      const { password, ...rest } = existingBundle
      setState(rest)
    }
    fetchData("/input/isapproved")
      .then((res) => {
        if (res.data) setInputs(res.data?.map((value: IInput) => value.name))
      })
      .catch((err) => toast.error(err))
    return () => {
      // setState(initialState)
      clearBundle({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
      dispatch(reset())
    }
  }, [location.pathname])

  useEffect(() => {}, [inputFields])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center md:mb-12 mb-6">
        <span onClick={handleGoBack}>
          <MdOutlineKeyboardBackspace
            size={24}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Bundle Form</h4>
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

          <Input
            name="total"
            label="Total loan amount"
            placeholder="0"
            onChange={handleChange}
            value={state?.total}
          />
          {state.inputs?.map((input, index) => (
            <React.Fragment key={index}>
              <Select
                name="input"
                label={"Input"}
                placeholder="input"
                className=""
                onChange={(e) => handleInputChange(e, index)}
                value={input.input}>
                <option> Select input</option>
                {inputs?.map((input, index) => {
                  return (
                    <option key={index} value={input}>
                      {input}
                    </option>
                  )
                })}
              </Select>
              <div className="hidden">
                <input
                  type="text"
                  name="inputs"
                  readOnly
                  value={JSON.stringify(state?.inputs)}
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
                  onChange={(e) => handleInputChange(e, index)}
                  value={input.quantity}
                />
                {(state.inputs?.length as number) > 1 && (
                  <MdCancel
                    className="text-2xl lg:text-3xl rounded-full bg-red-400 text-white"
                    onClick={() =>
                      setState({
                        ...state,
                        inputs: state.inputs?.filter(
                          (_input, i) => i !== index
                        ),
                      })
                    }
                  />
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
                inputs: [...state.inputs!, { input: "", quantity: "" }],
              })
            }>
            add more
          </Button>

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={bundleState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BundleForm
