/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { UserContext, emptyUser } from "."
import { IUser } from "../../../../interfaces/user"
import { useAppDispatch, useAppSelector } from "../../../../store"
import {
  updateUserError,
  updateUserReset,
  updateUserSelector,
} from "../../../../store/slices/users/update.slice"
import { updateUserAction } from "../../../../store/actions/users"
import { createUserReset } from "../../../../store/slices/users/create.slice"
import { FaFileImage } from "react-icons/fa"
import Input from "../../../../components/form/input"
import Select from "../../../../components/form/select"
import { Button } from "@material-tailwind/react"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { toast } from "react-toastify"

const initialState: IUser = {
  _id: undefined,
  name: undefined,
  email: undefined,
  gender: undefined,
  profile_img: undefined,
  phone: undefined,
  isEnable: undefined,
  role: undefined,
  address: undefined,
}
const createUserReducer = (prev: IUser, next: IUser) => ({ ...prev, ...next })

const ProfileForm = () => {
  const [state, setState] = useReducer(createUserReducer, initialState)
  const [preview, setPreview] = useState<string>()
  const [profileImg, setProfileImg] = useState<string>()

  const [existingUser, clearUser] = useContext(UserContext)

  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const inputRef = useRef<HTMLInputElement>(null)
  const updateState = useAppSelector(updateUserSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 //1MB
    const file = e.target.files![0]
    if (!file) return
    dispatch(updateUserReset())
    if (file.size > maxSize) {
      toast.error("Image size is too large")
      return dispatch(updateUserError("Image size is too large"))
    }

    const reader = new FileReader()

    reader.onload = function (event) {
      setPreview(event.target!.result as string)
      setProfileImg(event.target?.result as string)
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    if (profileImg) data.append("profile_img", profileImg)
    if (edit) {
      // delete state.warehouse
      delete state.password
      // delete state.supervisor
      delete state.field_officers
      // delete state.role

      dispatch(
        updateUserAction(
          {
            ...state,
            warehouse: state.warehouse && (state.warehouse as IWarehouse)._id,
            profile_img: profileImg,
          },
          () => {
            navigate(-1)
          }
        )
      )
      return
    }

    return
  }

  useEffect(() => {
    if (existingUser) {
      const { password, ...rest } = existingUser
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearUser(emptyUser)
      dispatch(createUserReset())
    }
  }, [])

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setState(initialState)
    }
  }, [location.pathname])

  return (
    <div className="h-full w-full lg:pr-5 py-4 lg:py-8">
      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <div className="flex flex-col gap-3 items-center">
          <p className="">Profile image</p>
          <div
            onClick={() => inputRef.current?.click()}
            className="bg-gray-50 cursor-pointer rounded-full w-[100px] md:w-[120px] h-[100px] md:h-[120px] grid place-content-center gap-[6px] overflow-hidden">
            {state?.profile_img || preview ? (
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
          <input ref={inputRef} type="file" hidden onChange={handleUpload} />
        </div>
        <form
          id="form"
          onSubmit={handleSubmit}
          className="h-fit flex flex-1 w-full lg:max-w-[70%] flex-col lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 lg:gap-y-8 lg:pr-16">
          <Input
            name="name"
            label="Full name"
            inputContainerStyle="col-span-2 w-full"
            placeholder="full name"
            value={state?.name}
            onChange={handleChange}
          />

          <Input
            name="email"
            label="Email address*"
            placeholder="Email address"
            onChange={handleChange}
            value={state?.email}
          />
          <Input
            name="phone"
            label="Phone number*"
            placeholder="Phone number"
            value={state?.phone}
            onChange={handleChange}
          />
          <Select
            name="gender"
            label="Gender*"
            placeholder="Select gender"
            value={state?.gender}
            onChange={handleChange}>
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          <Input
            name="address"
            label="Address"
            placeholder="Block C9, main Street"
            value={state?.address}
            onChange={handleChange}
          />

          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={updateState.isLoading || updateState.error}
              className="w-[70%] bg-green-600 py-3">
              {updateState.isLoading
                ? "Loading..."
                : edit
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileForm
