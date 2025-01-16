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
import {Button, Chip} from "@material-tailwind/react"
import Input from "../../../components/form/input"
import {IVisitation} from "../../../interfaces/visitation"
import {useAppDispatch, useAppSelector} from "../../../store"
import {visitationSelector, reset} from "../../../store/slices/visitation"
import {
  createVisitationAction,
  updateVisitationAction,
} from "../../../store/actions/visitation"
import {VisitationContext} from "./"
import {IFarmer} from "../../../interfaces/farmer"
import {fetchData} from "../../../utils"
import Select from "../../../components/form/select"

const initialState: IVisitation = {
  farmer_id: undefined,
  visitation_count: undefined,
  commodity: [""],
  farm_location: undefined,
  comment: undefined,
  village: undefined,
  havest_date: undefined,
}
const visitationReducer = (prev: IVisitation, next: IVisitation) => ({
  ...prev,
  ...next,
})

const VisitationForm = () => {
  const [state, setState] = useReducer(visitationReducer, initialState)
  const [existingVisitation, clearVisitation] = useContext(VisitationContext)
  const [farmers, setFarmerSuggestion] = useState<IFarmer[]>()
  const [imgUpload, setImgUpload] = useState<string | ArrayBuffer | null>()
  const [selectedCommodities, setSelectedCommodities] = useState<string>()

  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const visitationState = useAppSelector(visitationSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target
    if (name === "commodity") {
      setSelectedCommodities(value)
      return
    }
    setState({...state, [name]: value})
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      setImgUpload(reader.result)
    }
  }

  function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
    const {value} = e.target
    setState({...state, farm_location: {lat: value, lng: value}})
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.delete("commodities")
    data.delete("location")

    if (imgUpload)
      data.append("file", new Blob([imgUpload as string]), "upload")
    if (selectedCommodities) data.set("commodity", selectedCommodities)

    if (edit) {
      dispatch(
        updateVisitationAction(state, () => {
          navigate(-1)
        })
      )
      return
    }

    dispatch(
      createVisitationAction(data, () => {
        navigate(-1)
      })
    )
    return
  }

  useEffect(() => {
    if (existingVisitation) {
      const {...rest} = existingVisitation
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearVisitation({})
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    fetchData("/farmer")
      .then((res) => {
        if (res.data) setFarmerSuggestion(res.data)
      })
      .catch((err) => console.log(err))
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
        <h4 className="text-xl lg:text-2xl text-green-500">
          Visitation Report Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <form
          id="form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <div className="col-span-2">
            <Input
              label="Farmer id"
              type="search"
              list="farmer_name"
              autoComplete="farmer"
              name="farmer_id"
              onChange={handleChange}
              value={state.farmer_id}
            />
            <datalist
              id="farmer_name"
              placeholder="enter farmer name"
              className="w-full">
              {farmers?.map((farmer, index) => {
                return (
                  <option
                    key={index}
                    className="w-full"
                    value={farmer.farmer_id}
                    children={farmer.first_name}
                  />
                )
              })}
            </datalist>
          </div>

          <Select
            name="visitation_count"
            label="Visitation"
            placeholder="Visitation time"
            onChange={handleChange}
            value={state?.visitation_count}>
            <option>Select Visitation</option>

            <option value={1}>1st visitation</option>
            <option value={2}>2nd visitation</option>
            <option value={3}>3rd visitation</option>
          </Select>
          <Input
            name="village"
            label="Village"
            placeholder=""
            value={state?.village}
            onChange={handleChange}
          />
          <Input
            name="location"
            label="Location"
            placeholder=""
            onChange={handleLocationChange}
          />
          <div className="hidden">
            <input
              type="text"
              className=""
              name="farm_location"
              onChange={handleLocationChange}
              value={JSON.stringify(state?.farm_location)}
            />
          </div>
          <Input
            name="havest_date"
            type="date"
            label="Expected havest time"
            placeholder=""
            value={state?.havest_date}
            onChange={handleChange}
          />
          <Input
            name="commodity"
            type="text"
            label="Commodities"
            inputContainerStyle="col-span-2"
            placeholder=""
            value={selectedCommodities}
            onChange={handleChange}
          />
          <div className="col-span-2 flex flex-wrap w-full gap-2 lg:-mt-5">
            {selectedCommodities?.split(",").map((com) => (
              <Chip value={com.trim()} color="green" className="w-fit" />
            ))}
          </div>

          <Input
            name="comment"
            label="Comment"
            placeholder=""
            value={state?.comment}
            onChange={handleChange}
          />

          <Input
            name="upload"
            label="Upload Picture"
            type="file"
            placeholder=""
            onChange={handleUpload}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={visitationState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {visitationState.isLoading
                ? "Loading..."
                : edit
                ? "Update"
                : "submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VisitationForm
