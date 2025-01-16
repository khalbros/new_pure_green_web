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
import { IInput } from "../../../../interfaces/input"
import { useAppDispatch } from "../../../../store"
import { InputContext } from "../"
import { reset } from "../../../../store/slices/input"
import {
  createInputAction,
  updateInputAction,
} from "../../../../store/actions/input"
import { useQueryClient } from "react-query"

const initialState: IInput = {
  name: undefined,
}
const inputReducer = (prev: IInput, next: IInput) => ({
  ...prev,
  ...next,
})

const AdminInputForm = () => {
  const [state, setState] = useReducer(inputReducer, initialState)
  const [existingInput, clearInput] = useContext(InputContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

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
        updateInputAction(state, () => {
          queryClient.invalidateQueries("inputs", { exact: true })
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createInputAction(data, () => {
        queryClient.invalidateQueries("inputs", { exact: true })
        setState(initialState)
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
  }, [location.pathname])

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row flex-1 gap-4 items-end mt-4">
      <Input
        name="name"
        inputContainerStyle="w-full"
        placeholder="Add new Input here..."
        value={state?.name}
        onChange={handleChange}
      />

      <Button
        type="submit"
        className="flex w-full items-center justify-center text-base md:w-[70%] bg-green-600 lg:text-lg tracking-wider">
        {edit ? "Update" : "Submit"}
      </Button>
    </form>
  )
}

export default AdminInputForm
