/* eslint-disable @typescript-eslint/no-unused-vars */
import {
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
import {IGrade} from "../../../interfaces/grade"
import {useAppDispatch, useAppSelector} from "../../../store"
import {GradeContext} from "."
import {gradeSelector} from "../../../store/slices/grade"
import {
  createGradeAction,
  updateGradeAction,
} from "../../../store/actions/grade"
import {reset} from "../../../store/slices/warehouse"

const initialState: IGrade = {
  name: undefined,
  percentage: undefined,
}
const gradeReducer = (prev: IGrade, next: IGrade) => ({
  ...prev,
  ...next,
})

const GradeForm = () => {
  const [state, setState] = useReducer(gradeReducer, initialState)
  const [existingGrade, clearGrade] = useContext(GradeContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const gradeState = useAppSelector(gradeSelector)

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
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    if (edit) {
      dispatch(
        updateGradeAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createGradeAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingGrade) {
      const {password, ...rest} = existingGrade
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearGrade({})
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
            size={24}
            className="mr-3 cursor-pointer text-green-500"
          />
        </span>
        <h4 className="text-xl lg:text-2xl text-green-500">Grade Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="name"
            label="Grade Name"
            inputContainerStyle=""
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />
          <Input
            name="percentage"
            label="Grade % deduction"
            placeholder="0"
            onChange={handleChange}
            value={state?.percentage}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={gradeState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GradeForm
