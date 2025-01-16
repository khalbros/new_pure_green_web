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
import {IProject} from "../../../interfaces/project"
import {useAppDispatch} from "../../../store"

import {ProjectContext} from "."
import {reset} from "../../../store/slices/project"
import {
  createProjectAction,
  updateProjectAction,
} from "../../../store/actions/project"

const initialState: IProject = {
  name: undefined,
  code: undefined,
  start: undefined,
  end: undefined,
}
const projectReducer = (prev: IProject, next: IProject) => ({
  ...prev,
  ...next,
})

const ProjectForm = () => {
  const [state, setState] = useReducer(projectReducer, initialState)
  const [existingProject, clearProject] = useContext(ProjectContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

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
        updateProjectAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createProjectAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingProject) {
      const {password, ...rest} = existingProject
      setState(rest)
    }

    return () => {
      // setState(initialState)
      clearProject({})
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
        <h4 className="text-xl lg:text-2xl text-green-500">
          Project Scheduling Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <Input
            name="name"
            label="Project name"
            inputContainerStyle=""
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="code"
            label="Project code"
            placeholder=""
            onChange={handleChange}
            value={state?.code}
          />
          <Input
            type="date"
            name="start"
            label="Start date"
            placeholder=""
            onChange={handleChange}
            value={state?.start}
          />
          <Input
            type="date"
            name="end"
            label="End date"
            placeholder=""
            onChange={handleChange}
            value={state?.end}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              //   disabled={signUpState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm
