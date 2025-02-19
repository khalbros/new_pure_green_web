/* eslint-disable react-hooks/exhaustive-deps */
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
import { MdError } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { IUser } from "../../../interfaces/user"
import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react"
import Input from "../../../components/form/input"
import Select from "../../../components/form/select"
import { FaFileImage } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../../store"
import {
  createUserReset,
  createUserSelector,
} from "../../../store/slices/users/create.slice"
import {
  createUserAction,
  updateUserAction,
} from "../../../store/actions/users"
import { UserContext } from "."
import { fetchData } from "../../../utils"
import { updateUserSelector } from "../../../store/slices/users/update.slice"
import { IWarehouse } from "../../../interfaces/warehouse"

const initialState: IUser = {
  _id: undefined,
  name: undefined,
  email: undefined,
  gender: undefined,
  profile_img: undefined,
  phone: undefined,
  isEnable: undefined,
  role: undefined,
}
const createUserReducer = (prev: IUser, next: IUser) => ({ ...prev, ...next })

const UsersForm = () => {
  const [state, setState] = useReducer(createUserReducer, initialState)
  const [warehouse, setWarehouse] = useState<IWarehouse[]>([])
  const [selected_wh, setSelected_wh] = useState<IWarehouse[]>([])
  const [supervisors, setSupervisors] = useState<IUser[]>([])
  const [preview, setPreview] = useState<string>()
  const [profileImg, setProfileImg] = useState<string>()
  const [existingUser, clearUser] = useContext(UserContext)

  const location = useLocation()
  const edit = useMemo(() => location.pathname.includes("/edit"), [location])

  const inputRef = useRef<HTMLInputElement>(null)
  const createState = useAppSelector(createUserSelector)
  const updateState = useAppSelector(updateUserSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
    if (
      name === "role" &&
      (value === "WAREHOUSE MANAGER" || "WAREHOUSE ADMIN")
    ) {
      fetchData("/warehouse").then((res) => {
        if (res.data) setWarehouse(res.data)
      })
    }
    if (value === "FIELD OFFICER") {
      fetchData(`/users?role=WAREHOUSE ADMIN`).then((res) => {
        if (res.data) setSupervisors(res.data)
      })
    }
  }
  const handleCheckBox = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    if (checked) {
      setSelected_wh((prev) => {
        return [...prev, warehouse.find((p) => p._id === value)!]
      })
    } else {
      setSelected_wh((prev) => {
        return prev.filter((p) => p._id !== value)
      })
      return
    }
    setState({
      ...state,
      area_warehouse: selected_wh.flatMap((w) => w._id) as string[],
    })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (!file) return

    const reader = new FileReader()
    const readerPrev = new FileReader()

    reader.onload = function (event) {
      setProfileImg(event.target?.result as string)
    }
    readerPrev.readAsDataURL(file)
    readerPrev.onload = function (event) {
      setPreview(event.target!.result as string)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = document.getElementById("form") as HTMLFormElement
    const data = new FormData(form)
    if (profileImg) data.append("profile_img", new Blob([profileImg!]))
    data.append("password", "12345")
    if (selected_wh.length > 0)
      data.append(
        "area_warehouse",
        JSON.stringify(selected_wh.flatMap((w) => w._id) as string[])
      )

    if (edit) {
      delete state.password
      dispatch(
        updateUserAction(
          {
            ...state,
            profile_img: profileImg as never,
            area_warehouse: selected_wh.flatMap((w) => w._id) as string[],
          },
          () => {
            navigate(-1)
          }
        )
      )
      return
    }

    dispatch(
      createUserAction(data, () => {
        navigate(-1)
      })
    )

    return
  }

  useEffect(() => {
    if (existingUser) {
      const { password, ...rest } = existingUser
      setState(rest)
    }

    return () => {
      setState(initialState)
      clearUser({})
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
      <div className="flex items-center md:mb-12 mb-6">
        <h4 className="text-xl lg:text-2xl text-green-500">User Form</h4>
      </div>

      {/* Form Error */}
      <Alert
        color="red"
        className="mb-12"
        icon={<MdError size={24} />}
        open={createState.error ? true : false}>
        {createState.message}
      </Alert>
      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[66px] lg:h-[calc(100%-48px)] lg:pl-6">
        <div className="flex flex-col gap-3 items-center">
          <p className="">Profile image</p>
          <div
            onClick={() => inputRef.current?.click()}
            className="bg-gray-50 cursor-pointer rounded-full w-[100px] md:w-[120px] h-[100px] md:h-[120px] grid place-content-center gap-[6px] overflow-hidden">
            {state.profile_img || preview ? (
              <img
                src={preview || state.profile_img?.url}
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
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          <Select
            name="role"
            label="Role*"
            placeholder="Select role"
            onChange={handleChange}
            value={state?.role}>
            <option>Select Role</option>
            {[
              "SUPER ADMIN",
              "DATA ANALYST",
              "AREA SALES MANAGER",
              "WAREHOUSE MANAGER",
              "WAREHOUSE ADMIN",
              "FIELD OFFICER",
              "FINANCIAL OFFICER",
            ].map((role, index) => {
              return (
                <option key={index} value={role}>
                  {role}
                </option>
              )
            })}
          </Select>

          {state?.role === "WAREHOUSE MANAGER" ||
          state?.role === "WAREHOUSE ADMIN" ? (
            <Select
              name="warehouse"
              label="Warehouse*"
              placeholder="Select warehouse"
              onChange={handleChange}
              value={edit ? (state.warehouse as any)?.name : state?.warehouse}>
              <option disabled selected>
                Select Warehouse
              </option>
              {warehouse?.map((warehouse, index) => {
                return (
                  <option key={index} value={warehouse._id} className="my-3">
                    {warehouse.name}
                  </option>
                )
              })}
            </Select>
          ) : state?.role === "AREA SALES MANAGER" ? (
            <>
              <Typography className="capitalize text-base font-normal tracking-wide text-[#281103]">
                Select Warehouses
              </Typography>
              <List className="flex-col w-full p-0 m-0">
                {warehouse?.map((wh) => (
                  <ListItem className="p-0" key={wh._id}>
                    <label
                      htmlFor={wh.name}
                      className="py-2 flex items-center justify-between w-full cursor-pointer">
                      <Typography color="black" className="capitalize">
                        {wh.name}
                      </Typography>
                      <ListItemSuffix className="">
                        <input
                          type="checkbox"
                          id={wh.name}
                          name={wh.name}
                          // ripple={false}
                          className="hover:before:opacity-0"
                          value={wh._id}
                          onChange={(e) => handleCheckBox(e)}
                          checked={selected_wh?.some((p) => p.name === wh.name)}
                        />
                      </ListItemSuffix>
                    </label>
                  </ListItem>
                ))}
              </List>
            </>
          ) : null}

          {state.role === "FIELD OFFICER" && (
            <Select
              name="supervisor"
              label="Supervisor*"
              placeholder="Select Supervisor"
              onChange={handleChange}
              value={state?.supervisor as string}>
              <option disabled selected>
                Select Supervisor
              </option>
              {supervisors.map((supervisor, index) => {
                return (
                  <option key={index} value={supervisor._id}>
                    {supervisor.name}
                  </option>
                )
              })}
            </Select>
          )}
          <div className="col-span-2 mt-8 text-center">
            <Button
              type="submit"
              disabled={createState.isLoading}
              className="w-[70%] bg-green-600 py-3">
              {createState.isLoading || updateState.isLoading
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

export default UsersForm
