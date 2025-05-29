/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IFarmer } from "../../../interfaces/farmer"
import { Button } from "@material-tailwind/react"
import Input from "../../../components/form/input"
import { useAppDispatch, useAppSelector } from "../../../store"
import { farmerSelector } from "../../../store/slices/farmer"
import {
  createFarmerAction,
  updateFarmerAction,
} from "../../../store/actions/farmer"
import { FarmerContext, emptyFarmer } from "."
import { reset } from "../../../store/slices/warehouse"
import Select from "../../../components/form/select"
import { fetchData } from "../../../utils"
import { ICooperative } from "../../../interfaces/cooperative"
import { FaFileImage } from "react-icons/fa"
import { toast } from "react-toastify"

const initialState: IFarmer = {
  first_name: undefined,
  last_name: undefined,
  other_name: undefined,
  gender: undefined,
  date_of_birth: undefined,
  phone: undefined,
  state: undefined,
  lga: undefined,
  village: undefined,
  address: undefined,
  id_type: undefined,
  id_number: undefined,
  account_name: undefined,
  account_number: undefined,
  bvn: undefined,
  bank_name: undefined,
  id_card: undefined,
  profile_img: undefined,
  cooperative: undefined,
  role: undefined,
  guarantor_name: undefined,
  guarantor_number: undefined,
  guarantor_village: undefined,
  guarantor_id_type: undefined,
  guarantor_id_number: undefined,
  guarantor_id: undefined,
  guarantor_address: undefined,
}
const createFarmerReducer = (prev: IFarmer, next: IFarmer) => ({
  ...prev,
  ...next,
})

const FarmerForm = () => {
  const [state, setState] = useReducer(createFarmerReducer, initialState)
  const [cooperativies, setCooperativies] = useState<ICooperative[]>()
  const [cooperative] = useState<string>()
  const [fID, setFID] = useState<string | ArrayBuffer | null>()
  const [gID, setGID] = useState<string | ArrayBuffer | null>()
  const [preview, setPreview] = useState<string>()
  const [profileImg, setProfileImg] = useState<
    string | ArrayBuffer | null | undefined
  >()
  const [existingFarmer, clearFarmer] = useContext(FarmerContext)

  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const farmerState = useAppSelector(farmerSelector)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "cooperative") {
      setState({
        ...state,
        cooperative: cooperativies?.find((c) => c.name === value)?._id,
      })
      return
    }
    setState({ ...state, [name]: value })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const name = e.target.name

    if (!file) return
    dispatch(reset())

    if (name === "id_card") {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = function () {
        setFID(reader.result)
      }
    }
    if (name === "guarantor_id") {
      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = function () {
        setGID(reader.result)
      }
    }

    if (name === "profile_img") {
      const reader = new FileReader()
      const readerPrev = new FileReader()

      readerPrev.readAsDataURL(file)
      readerPrev.onload = function () {
        setPreview(readerPrev.result as string)
      }

      reader.onload = function () {
        setProfileImg(reader.result)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    data.set("cooperative", String(state?.cooperative))
    // if (profileImg) data.append("profile_img", profileImg as string)
    if (profileImg) data.append("profile_img", new Blob([profileImg!]))
    data.append("file", new Blob([fID!]), "id_card")
    data.append("file", new Blob([gID!]), "guarantor_id")

    if (edit) {
      dispatch(
        updateFarmerAction(
          {
            ...state,
            profile_img: profileImg as never,
            id_card: fID as never,
            guarantor_id: gID as never,
          },
          () => {
            toast.success(`${state.first_name} ${state.last_name} updated!`)
            navigate(-1)
          }
        )
      )
      return
    }

    dispatch(
      createFarmerAction(data, () => {
        toast.success(`Farmer Created!`)
        navigate(-1)
      })
    )

    return
  }

  useEffect(() => {
    if (existingFarmer) {
      const { password, ...rest } = existingFarmer
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearFarmer(emptyFarmer)
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    fetchData("/cooperative")
      .then((res) => {
        if (res.data) setCooperativies(res.data)
      })
      .catch((err) => toast.error(err))
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
  }, [cooperative, location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex items-center justify-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">
          Farmer's Enrollment Form
        </h4>
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <div className="flex flex-col gap-3 items-center">
          <p className="">Profile image</p>
          <div
            onClick={() => inputRef.current?.click()}
            className="bg-gray-50 cursor-pointer rounded-full w-[120px] md:w-[140px] h-[120px] md:h-[140px] grid place-content-center gap-[6px] overflow-hidden">
            {state.profile_img || preview ? (
              <img
                src={preview || state?.profile_img?.url}
                alt="profile picture"
              />
            ) : (
              <>
                <FaFileImage size={30} className="mx-auto" />
                <p>Add image</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleUpload}
            name="profile_img"
          />
        </div>
        <form
          id="form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="first_name"
            label="First Name*"
            inputContainerStyle="col-span-2 w-full"
            placeholder="enter farmer first name"
            value={state?.first_name}
            onChange={handleChange}
          />
          <Input
            name="last_name"
            label="Last Name*"
            inputContainerStyle="w-full"
            placeholder="enter farmer surname/last name"
            value={state?.last_name}
            onChange={handleChange}
          />
          <Input
            name="other_name"
            label="Other Name"
            inputContainerStyle="w-full"
            placeholder="enter farmer Other/Midle  name"
            value={state?.other_name}
            onChange={handleChange}
          />

          <Select
            name="gender"
            label="Gender*"
            placeholder="Select gender"
            value={state?.gender}
            onChange={handleChange}>
            <option>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          <Input
            type="date"
            name="date_of_birth"
            label="Date of birth*"
            placeholder=""
            value={state?.date_of_birth}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone number*"
            placeholder="080XXXXXXX9"
            value={state?.phone}
            onChange={handleChange}
          />
          <Input
            name="state"
            label="State"
            placeholder="State*"
            value={state?.state}
            onChange={handleChange}
          />
          <Input
            name="lga"
            label="Local Govt.*"
            placeholder="Local government"
            value={state?.lga}
            onChange={handleChange}
          />
          <Input
            name="village"
            label="Village*"
            placeholder="Village"
            value={state?.village}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Residential address*"
            placeholder="Block C9, street"
            inputContainerStyle="col-span-2 lg:w-[80%]"
            value={state?.address}
            onChange={handleChange}
          />
          {/* <input ref={inputRef} type="file" hidden onChange={handleUpload} /> */}
          <Input
            name="farm_location"
            label="Farm Location / Address*"
            placeholder="Hayin gabari"
            inputContainerStyle="col-span-2 lg:w-[80%]"
            value={state?.farm_location}
            onChange={handleChange}
          />
          <>
            <Input
              label="Cooperative*"
              name="cooperative"
              type="search"
              list="cooperative_list"
              autoComplete="cooperativ list"
              onChange={handleChange}
            />
            <datalist id="cooperative_list" placeholder="" className="w-full">
              {cooperativies?.map((client, index) => {
                return (
                  <option key={index} className="w-full" value={client.name} />
                )
              })}
            </datalist>
          </>

          <Select
            name="role"
            label="Role*"
            placeholder=""
            value={state?.role}
            onChange={handleChange}>
            <option value={undefined}>Select role</option>
            <option value="Chairman">Chairman</option>
            <option value="Member">Member</option>
          </Select>
          <Select
            name="id_type"
            label="ID card type*"
            placeholder="Select gender"
            value={state?.id_type}
            onChange={handleChange}>
            <option value={undefined}>Select ID card type</option>
            <option value="nimc">NIMC</option>
            <option value="pvc">Voter's Card</option>
            <option value="license">Driver's License</option>
            <option value="passport">Passport</option>
          </Select>
          <Input
            name="id_number"
            label="ID number*"
            placeholder=""
            value={state?.id_number}
            onChange={handleChange}
          />
          <Input
            name="id_card"
            label="ID card"
            type="file"
            placeholder=""
            onChange={handleUpload}
          />
          <Input
            name="bvn"
            label="BVN number*"
            placeholder="22XXXXXXX1"
            value={state?.bvn}
            onChange={handleChange}
          />
          <Input
            name="account_number"
            label="Account number*"
            placeholder="10XXXXXXXX1"
            value={state?.account_number}
            onChange={handleChange}
          />
          <Input
            name="account_name"
            label="Account name*"
            placeholder="Your name"
            value={state?.account_name}
            onChange={handleChange}
          />
          <Input
            name="bank_name"
            label="Bank name*"
            placeholder="First Bank"
            value={state?.bank_name}
            onChange={handleChange}
          />
          <div className="col-span-2 text-gray-500 font-bold text-base md:text-lg lg:text-xl ">
            Guarantor's Details
          </div>
          <Input
            name="guarantor_name"
            label="Full name*"
            placeholder=""
            value={state?.guarantor_name}
            onChange={handleChange}
          />
          <Input
            name="guarantor_number"
            label="Phone number*"
            placeholder=""
            value={state?.guarantor_number}
            onChange={handleChange}
          />
          <Select
            name="guarantor_id_type"
            label="ID card type*"
            placeholder=""
            value={state?.guarantor_id_type}
            onChange={handleChange}>
            <option value={undefined}>Select ID card type</option>
            <option value="nimc">NIMC</option>
            <option value="pvc">Voter's Card</option>
            <option value="license">Driver's License</option>
            <option value="passport">Passport</option>
          </Select>
          <Input
            name="guarantor_id_number"
            label="ID number*"
            placeholder=""
            value={state?.guarantor_id_number}
            onChange={handleChange}
          />
          <Input
            name="guarantor_id"
            label="ID card"
            type="file"
            placeholder=""
            // value={state?.guarantor_id}
            onChange={handleUpload}
          />
          <Input
            name="guarantor_village"
            label="village*"
            placeholder=""
            value={state?.guarantor_village}
            onChange={handleChange}
          />
          <Input
            name="guarantor_address"
            label="Residential address*"
            placeholder="Block C9, street"
            inputContainerStyle="col-span-2 lg:w-[80%]"
            value={state?.guarantor_address}
            onChange={handleChange}
          />
          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={farmerState.isLoading}
              className="w-[70%] bg-green-600 py-2 tracking-wider text-base">
              {farmerState.isLoading ? (
                <span className="animate-ping">Loading...</span>
              ) : edit ? (
                "Update Farmer"
              ) : (
                "Create Farmer"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FarmerForm
