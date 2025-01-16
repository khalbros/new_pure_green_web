/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react"
import {
  Button,
  Dialog,
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
// import {FaEye, FaFilter} from "react-icons/fa"
import { TfiMore } from "react-icons/tfi"
import {
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../../assets/illustrations/no-data.png"
import { MdCancel, MdDeleteForever } from "react-icons/md"
import DeleteUser from "../../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../../hooks/usePagination"
import Input from "../../../../components/form/input"
import QueryResult from "../../../../components/queryResult"
import { IInput } from "../../../../interfaces/input"
import { InputContext } from "../"
import { useAppDispatch } from "../../../../store"
import {
  approveInputAction,
  deleteInputAction,
} from "../../../../store/actions/input"
import { fetchData, getUser } from "../../../../utils"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { useQuery, useQueryClient } from "react-query"
import InputForm from "./form"
import EmptyResult from "../emptyResult"

const AdminInputTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["inputs"],
    queryFn: async () => {
      return fetchData("/input/withQuantity").then((res) => res.data)
    },
  })

  const queryClient = useQueryClient()

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [inputs, setInputs] = useState<IInput[]>(data)
  const [input, setInput] = useState<IInput>()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(inputs)
  const [_ctx, dispatch] = useContext(InputContext)

  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setInputs(data)
      return
    }
    const result = (data as IInput[])?.filter((input) =>
      input.name?.toLowerCase().includes(value.toLowerCase())
    )
    setInputs(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (cooperative: IInput) => {
    dispatch(cooperative)
    navigate("edit")
  }
  // open drawer with users details
  // const toggleDrawer = (input?: IInput) => {
  //   if (input) {
  //     setInput(input)
  //   }
  //   setOpenDrawer(!openDrawer)
  // }

  // open or close delete dialog
  const toggleDiaglog = (input?: IInput) => {
    if (input) {
      setInput(input)
    }
    setOpenDialog(!openDialog)
  }
  // handle status
  const handleStatus = (input: IInput) => {
    dispatchAction(
      approveInputAction({ ...input }, () => {
        queryClient.invalidateQueries("inputs", { exact: true })
        setOpenDialog(!openDialog)
      })
    )
  }

  // open or close delete dialog
  const toggleDeleteDialog = (Input?: IInput) => {
    if (Input) {
      setInput(Input)
    }
    setOpenDelete(!openDelete)
  }
  // handle delete
  const handleDelete = (input: IInput) => {
    dispatchAction(
      deleteInputAction({ ...input }, () => {
        queryClient.invalidateQueries("inputs", { exact: true })
        setOpenDelete(!openDelete)
      })
    )
  }

  useEffect(() => {
    if (data) {
      setInputs(data)
    }
  }, [data, dispatchAction])

  return (
    <>
      <InputForm />
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? String(error) : ""}
        emptyResult={
          <EmptyResult
            item="Input"
            image={AddUser}
            path="/dashboard/input-management/add"
          />
        }>
        {/* <Button
          onClick={(_) => navigate("/dashboard/input-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Add Input
        </Button> */}

        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
        />

        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap capitalize">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10 text-green-700"></th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Input's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Quantity
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((input, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">{input.name}</td>
                    <td className="p-3">{input.quantity ?? 0}</td>

                    <td className="p-3">
                      {
                        <span
                          className={`${
                            input.isApproved ? "bg-green-400" : "bg-red-500"
                          } whitespace-nowrap px-4 py-1 text-center text-white uppercase rounded-full cursor-pointer`}>
                          {input?.isApproved ? "APPROVED" : "PENDING"}
                        </span>
                      }
                    </td>

                    <td className="p-3">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          {(currentUser?.role === "SUPER ADMIN" ||
                            currentUser?.role === "DATA ANALYST") &&
                            (input?.isApproved ? (
                              <MenuItem
                                onClick={() => toggleDiaglog(input)}
                                className="inline-flex gap-2 border-b-2">
                                <IoMdCloseCircle
                                  size={16}
                                  className="text-orange-800"
                                />{" "}
                                Reject
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={() => toggleDiaglog(input)}
                                className="inline-flex gap-2 border-b-2">
                                <IoMdCheckmarkCircle
                                  size={16}
                                  className="text-green-400"
                                />{" "}
                                Approve
                              </MenuItem>
                            ))}
                          <MenuItem
                            onClick={() => handleEdit(input)}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => toggleDeleteDialog(input)}
                            className="inline-flex gap-2 border-b-2">
                            <MdDeleteForever
                              size={16}
                              className="text-red-400"
                            />{" "}
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </>
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
              Are you sure you want to{" "}
              {input?.isApproved ? "disable" : "approve"} “{input?.name}”
            </p>
            <Button
              onClick={() =>
                handleStatus({
                  ...input,
                  isApproved: input?.isApproved ? false : true,
                })
              }
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
              Are you sure you want to DELETE “{input?.name}”
            </p>
            <Button
              onClick={() => handleDelete(input!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        {/* <Details user={user} open={openDrawer} close={toggleDrawer} /> */}
      </QueryResult>
    </>
  )
}

export default AdminInputTable
