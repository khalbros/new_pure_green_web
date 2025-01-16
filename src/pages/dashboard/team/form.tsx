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
import {MdCancel, MdOutlineKeyboardBackspace} from "react-icons/md"
import {useLocation, useNavigate} from "react-router-dom"
import {Button} from "@material-tailwind/react"
import Input from "../../../components/form/input"
import {ITeam} from "../../../interfaces/team"
import {useAppDispatch, useAppSelector} from "../../../store"

import {TeamContext} from "."
import {teamSelector, reset} from "../../../store/slices/team"
import {createTeamAction, updateTeamAction} from "../../../store/actions/team"
import {fetchData} from "../../../utils"
import {IUser} from "../../../interfaces/user"
import {ICooperative} from "../../../interfaces/cooperative"
import {toast} from "react-toastify"
import useFetch from "../../../hooks/useFetch"

const initialState: ITeam = {
  name: undefined,
  cooperativies: [""],
  supervisor: undefined,
}
const teamReducer = (prev: ITeam, next: ITeam) => ({
  ...prev,
  ...next,
})

const TeamForm = () => {
  const {data} = useFetch("/cooperative")
  const [state, setState] = useReducer(teamReducer, initialState)
  const [existingTeam, clearTeam] = useContext(TeamContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])
  const [supervisors, setSupervisors] = useState<IUser[]>()
  const [cooperativies, setCooperativies] = useState<ICooperative[]>(data)
  const teamState = useAppSelector(teamSelector)

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const {value} = e.target

    setState({
      ...state,
      cooperativies: state.cooperativies?.map((cooperative, i) =>
        i === index ? value : cooperative
      ),
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)

    const supervisor = supervisors?.find(
      (sup) => sup.name === state?.supervisor
    )?._id
    const cooperativie = state?.cooperativies?.map(
      (cooperative) =>
        cooperativies?.find((coop) => coop.name === cooperative)?._id
    )

    if (!supervisor) {
      toast.error("Invalid supervisor")
      return
    }

    data.set("supervisor", String(supervisor))
    data.set("cooperativies", JSON.stringify(cooperativie))
    data.delete("cooperative")
    if (edit) {
      dispatch(
        updateTeamAction(state, () => {
          navigate(-1)
        })
      )
      return
    }
    dispatch(
      createTeamAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingTeam) {
      const {password, ...rest} = existingTeam
      setState(rest)
    }

    return () => {
      // setState(initialState)
      clearTeam({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
    fetchData("/users?role=WAREHOUSE ADMIN")
      .then((res) => {
        if (res.data) setSupervisors(res.data)
      })
      .catch((err) => console.log(err))
    fetchData("/cooperative")
      .then((res) => {
        if (res.data) setCooperativies(res.data)
      })
      .catch((err) => console.log(err))
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
        <h4 className="text-xl lg:text-2xl text-green-500">Team Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-5 lg:pr-16">
          <Input
            name="name"
            label="Team name"
            inputContainerStyle=""
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />

          <>
            <Input
              label="Supervisor"
              type="search"
              list="supervisor_list"
              autoComplete="supervisor"
              name="supervisor"
              onChange={handleChange}
              value={state.supervisor}
            />
            <datalist
              id="supervisor_list"
              placeholder="enter client name"
              className="w-full">
              {supervisors?.map((supervisor) => (
                <option key={supervisor._id} value={supervisor.name}>
                  {supervisor.phone}
                </option>
              ))}
            </datalist>
          </>
          {state.cooperativies?.map((cooperative, index) => (
            <div
              key={index}
              className="col-span-2 flex w-full items-center gap-2">
              <>
                <Input
                  label="Cooperative"
                  type="search"
                  list="cooperative_list"
                  autoComplete="cooperative_list"
                  name="cooperative"
                  onChange={(e) => handleInputChange(e, index)}
                  value={cooperative}
                  inputContainerStyle="w-full"
                />
                <datalist
                  id="cooperative_list"
                  placeholder="enter cooperative name"
                  className="w-full">
                  {cooperativies?.map((cooperative) => (
                    <option
                      key={cooperative._id}
                      value={cooperative.name}></option>
                  ))}
                </datalist>
                <div className="hidden">
                  <input
                    type="text"
                    name="cooperativies"
                    value={JSON.stringify(state?.cooperativies)}
                  />
                </div>
              </>
              <div>
                {(state.cooperativies?.length as number) > 1 && (
                  <MdCancel
                    className="text-2xl lg:text-3xl rounded-full bg-red-400 text-white"
                    onClick={() =>
                      setState({
                        ...state,
                        cooperativies: state.cooperativies?.filter(
                          (_input, i) => i !== index
                        ),
                      })
                    }
                  />
                )}
              </div>
            </div>
          ))}
          <Button
            color="light-green"
            className="w-[40%] lg:w-full self-end lg:col-start-2"
            onClick={() =>
              setState({
                ...state,
                cooperativies: [...state.cooperativies!, ""],
              })
            }>
            add more
          </Button>

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={teamState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {edit ? "Update Team" : "Add Team"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TeamForm
