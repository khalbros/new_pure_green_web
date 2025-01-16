/* eslint-disable @typescript-eslint/no-unused-vars */
import {Dialog, DialogBody} from "@material-tailwind/react"
import {useContext, useEffect, useState} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate, useLocation} from "react-router-dom"
import {IUser} from "../../../../interfaces/user"
import {IWarehouse} from "../../../../interfaces/warehouse"
import {FcPicture} from "react-icons/fc"
import {fetchData} from "../../../../utils"
import {toast} from "react-toastify"
import {ICooperative} from "../../../../interfaces/cooperative"
import {UserContext} from "."
import useFetch from "../../../../hooks/useFetch"

const UserProfile = () => {
  // const current_user = useMemo(() => JSON.parse(getUser()!), [])
  const user = useFetch("/users/profile").data
  const navigate = useNavigate()
  const location = useLocation()
  const [_ctx, dispatch] = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [cooperativies, setCooperativies] = useState<ICooperative[]>()

  const handleEditUser = () => {
    dispatch(user)
    navigate("edit")
  }

  useEffect(() => {
    if (user?.role === "WAREHOUSE ADMIN") {
      console.log(user._id)

      fetchData(`/cooperative/bysupervisor/${user?._id}`)
        .then(
          (res) => {
            setCooperativies(res.data)
          },
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    }
  }, [location.pathname])

  return (
    <div className="">
      <div className="">
        {/* User details */}
        <div className="flex flex-col lg:flex-row gap-10 p-5 items-center lg:justify-start">
          <div
            className="flex items-center justify-center h-36 w-36 rounded-full bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear"
            onClick={() => setOpen(!open)}>
            {user?.profile_img ? (
              <img src={user.profile_img} alt="profile_pic" />
            ) : (
              <FcPicture size={35} color="red" />
            )}
          </div>
          <div className="grid grid-flow-col grid-cols-4 col-span-3 w-full">
            <div className="flex flex-col gap-4 col-span-3 capitalize">
              <p className="font-bold tracking-[0.5 px] capitalize">
                <span className="text-gray-600">Full Name</span>: {user?.name}
              </p>
              <p>
                <span className="text-gray-600">Role</span>: {user?.role}
              </p>
              <p className="lowercase">
                <span className="text-gray-600">Email</span>: {user?.email}
              </p>
              <p>
                <span className="text-gray-600">Phone number</span>:{" "}
                {user?.phone}
              </p>
              {user?.address && (
                <p>
                  <span className="text-gray-600">Address</span>:{" "}
                  {user?.address}
                </p>
              )}
              {user?.warehouse && (
                <p className="flex gap-2">
                  <span className="text-gray-600">Warehouse:</span>
                  {(user?.warehouse as IWarehouse).name}
                </p>
              )}
              {user?.supervisor && (
                <p>
                  <span className="text-gray-600">Supervisor</span>:{" "}
                  {(user?.supervisor as IUser).name}
                </p>
              )}
              {Number(user?.field_officers?.length) > 0 && (
                <div className="grid grid-flow-col items-start gap-2 place-content-start">
                  <span className="text-gray-600">Field Officers:</span>
                  <div className="flex flex-col gap-1 md:gap-2">
                    {(user?.field_officers as IUser[]).map((feo) => (
                      <span className="" key={feo._id}>
                        {feo.name},{" "}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {cooperativies && cooperativies.length > 0 && (
                <div className="grid grid-flow-col items-start gap-2 place-content-start">
                  <span className="text-gray-600">Cooperativies: </span>
                  <div className="flex flex-1 flex-col gap-1 md:gap-2">
                    {cooperativies.map((cooperative) => (
                      <span className="" key={cooperative._id}>
                        {cooperative.name},
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="" onClick={handleEditUser}>
              <span className="cursor-pointer rounded p-1 flex gap-2 items-center justify-center w-fit px-6 bg-gray-100">
                <AiFillEdit /> Edit
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* User activity */}
      <hr />
      <div className="py-4 flex flex-col gap-6">
        <h4 className="font-[500]">User's Statistics</h4>
        <div className="p-4 w-full border rounded-lg">
          <div className="flex gap-[11px] mb-4">
            <p className="text-gray-700 flex-1">Activitie </p>
            <select name="" id="">
              <option value="">2023</option>
            </select>
            <select className="bg-gray-100 p-1 rounded" name="" id="">
              <option value="">Weekly</option>
            </select>
          </div>

          <div className="flex justify-center gap-[5px] mb-[30px]">
            <select name="" id="">
              <option value="">Jan 1 - Jan 7</option>
            </select>
            <p className="bg-gray-100 p-1 rounded" id="">
              Week total: 30
            </p>
          </div>

          <div className="flex justify-between">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((key) => (
              <div key={key} className="inline-flex flex-col items-center">
                <div
                  className={`w-[7px] bg-[#546E7A] h-[126px] rounded-t-lg mb-[6px]`}></div>
                <p>{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog size="sm" open={open} handler={() => setOpen(!open)}>
        <DialogBody className="">
          <div className="flex justify-end">
            {" "}
            <MdCancel
              className="cursor-pointer"
              size={20}
              onClick={() => setOpen(!open)}
            />{" "}
          </div>
          {user?.profile_img ? (
            <img src={user.profile_img} alt="profile_pic" />
          ) : (
            <FcPicture size={50} color="red" className="mx-auto" />
          )}
        </DialogBody>
      </Dialog>
    </div>
  )
}

export default UserProfile
