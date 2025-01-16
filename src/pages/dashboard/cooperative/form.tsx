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
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import Input from "../../../components/form/input"
import { ICooperative } from "../../../interfaces/cooperative"
import { useAppDispatch, useAppSelector } from "../../../store"
import { cooperativeSelector, reset } from "../../../store/slices/cooperative"
import {
  createCooperativeAction,
  updateCooperativeAction,
} from "../../../store/actions/cooperative"
import { CooperativeContext } from "."
import { toast } from "react-toastify"

const initialState: ICooperative = {
  name: undefined,
  chairman: undefined,
  phone: undefined,
  village: undefined,
  village_head: undefined,
}
const cooperativeReducer = (prev: ICooperative, next: ICooperative) => ({
  ...prev,
  ...next,
})

const CooperativeForm = () => {
  const [state, setState] = useReducer(cooperativeReducer, initialState)
  const [collateral, setCollateral] = useState<string | ArrayBuffer | null>()
  const [existingCooperative, clearCooperative] = useContext(CooperativeContext)
  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const cooperativeState = useAppSelector(cooperativeSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    //  const name = e.target.name
    // const maxSize = 1024 * 1024 //1MB

    if (!file) return
    dispatch(reset())
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      setCollateral(reader.result)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.append("file", new Blob([collateral!]), "collateral")
    if (edit) {
      dispatch(
        updateCooperativeAction(
          { ...state, collateral: collateral as never },
          () => {
            toast.success(`${state.name} updated!`)
            navigate(-1)
          }
        )
      )
      return
    }

    dispatch(
      createCooperativeAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingCooperative) {
      const { password, ...rest } = existingCooperative
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearCooperative({})
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
        <h4 className="text-xl lg:text-2xl text-green-500">Cooperative Form</h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="name"
            label="Cooperative Name*"
            inputContainerStyle="col-span-2 w-full"
            placeholder=""
            value={state?.name}
            onChange={handleChange}
          />
          <Input
            name="cac"
            label="CAC Number"
            inputContainerStyle="col-span-2 w-full"
            placeholder=""
            value={state?.cac}
            onChange={handleChange}
          />

          <Input
            name="chairman"
            label="Cooperative Chairman*"
            placeholder=""
            onChange={handleChange}
            value={state?.chairman}
          />
          <Input
            name="phone"
            label="Phone Number*"
            placeholder=""
            value={state?.phone}
            onChange={handleChange}
          />
          <Input
            name="bvn"
            label="BVN*"
            placeholder=""
            value={state?.bvn}
            onChange={handleChange}
          />
          <Input
            name="nin"
            label="NIN*"
            placeholder=""
            value={state?.nin}
            onChange={handleChange}
          />
          <Input
            name="village"
            label="Village*"
            placeholder=""
            value={state?.village}
            onChange={handleChange}
          />
          <Input
            name="village_head"
            label="Village Head*"
            placeholder=""
            value={state?.village_head}
            onChange={handleChange}
          />
          <Input
            name="collateral"
            label="Collateral*"
            type="file"
            placeholder=""
            onChange={handleUpload}
          />
          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={cooperativeState.isLoading}
              className="w-[70%] bg-green-600 py-2 text-base tracking-wide">
              {edit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CooperativeForm
