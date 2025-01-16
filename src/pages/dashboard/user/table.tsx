/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import { MdAdd, MdCancel } from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import { IUser } from "../../../interfaces/user"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import useFetch from "../../../hooks/useFetch"
import { UserContext } from "."
import {
  deleteUserAction,
  resetUserPasswordAction,
  updateUserAction,
} from "../../../store/actions/users"
import { useAppDispatch, useAppSelector } from "../../../store"
import { updateUserSelector } from "../../../store/slices/users/update.slice"
import { fetchData, getUser } from "../../../utils"
import { toast } from "react-toastify"
import DesktopList from "./components/large-screens/table"
import MobileList from "./components/small-screens/list"

const Table = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDialogReset, setOpenDialogReset] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [users, setUsers] = useState<IUser[]>()
  const [user, setUser] = useState<IUser>()
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const usersState = useAppSelector(updateUserSelector)
  const [_ctx, dispatch] = useContext(UserContext)
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(users)

  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const feos = useMemo(() => location.pathname.includes("/feos"), [location])

  const { data, error, loading, message } = useFetch(
    `/users/${feos ? "feos/all" : ""}`
  )
  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setUsers(data)
      return
    }
    const result = (data as IUser[])?.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.role?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
        user.phone?.toLowerCase().includes(value.toLowerCase())
    )
    setUsers(result)
  }

  // open or close reset dialog
  const toggleDiaglogReset = (user?: IUser) => {
    if (user) {
      setUser(user)
    }
    setOpenDialogReset(!openDialogReset)
  }

  // open or close enable/dissable dialog
  const toggleDiaglog = (user?: IUser) => {
    if (user) {
      setUser(user)
    }
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDeleteDialog = (user?: IUser) => {
    if (user) {
      setUser(user)
    }
    setOpenDelete(!openDelete)
  }
  // handle delete
  const handleDelete = (user: IUser) => {
    dispatchAction(
      deleteUserAction({ ...user }, () => setOpenDelete(!openDelete))
    )
  }

  useEffect(() => {
    fetchData(`/users/${feos ? "feos/all" : ""}`)
      .then(
        (res) => setUsers(res.data),
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [data, dispatch, usersState.data])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="User"
            image={AddUser}
            path="/dashboard/user-management/add"
          />
        }>
        {currentUser.role === "SUPER ADMIN" && (
          <Button
            onClick={() => navigate("/dashboard/user-management/add")}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" /> Add New User
          </Button>
        )}
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
        />

        <div className="lg:hidden">
          <MobileList users={currentItems} />
        </div>
        <div className="hidden lg:flex">
          <DesktopList users={currentItems} />
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          {/* Previous Button */}
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="next-prev-btn"
            variant="outlined">
            <AiOutlineArrowLeft /> previous
          </Button>
          {/* pages */}
          <ul className="flex">
            {pages?.map((page) => (
              <li
                onClick={() => changePage(page)}
                key={page}
                className={`pagination-item ${
                  currentPage === page ? "bg-gray-100" : ""
                }`}>
                {page}
              </li>
            ))}
          </ul>
          {/* Next Button */}
          <Button
            onClick={nextPage}
            disabled={currentPage === pages?.length}
            className="next-prev-btn"
            variant="outlined">
            next <AiOutlineArrowRight />
          </Button>
        </div>

        {/* enable / dissable users */}
        <Dialog size="sm" open={openDialog} handler={toggleDiaglog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDiaglog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to {user?.isEnable ? "disable" : "enable"}{" "}
              user with the name “{user?.name}”
            </p>
            <Button
              onClick={() => {
                dispatchAction(
                  updateUserAction({ ...user, isEnable: !user?.isEnable }, () =>
                    toggleDiaglog()
                  )
                )
              }}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        {/* reset  password */}
        <Dialog size="sm" open={openDialogReset} handler={toggleDiaglogReset}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDiaglogReset()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to Reset this user's “{user?.name}”
              password?
            </p>
            <Button
              onClick={() => {
                dispatchAction(
                  resetUserPasswordAction(
                    { email: user?.email, password: "12345" },
                    () => toggleDiaglogReset()
                  )
                )
              }}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        {/* delete */}
        <Dialog size="sm" open={openDelete} handler={toggleDeleteDialog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDeleteDialog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[120px] mx-auto mb-7 block"
              alt="delete farmer"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to DELETE “{user?.name}”
            </p>
            <Button
              onClick={() => handleDelete(user!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
      </QueryResult>
    </>
  )
}

export default Table
