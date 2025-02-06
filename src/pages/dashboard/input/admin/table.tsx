/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import AddUser from "../../../../assets/illustrations/no-data.png"
import { MdCancel } from "react-icons/md"
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
import { fetchData } from "../../../../utils"
import { useQuery, useQueryClient } from "react-query"
import InputForm from "./form"
import EmptyResult from "../emptyResult"
import MobileList from "./mobileList"
import DesktopList from "./desktopList"

const AdminInputTable = () => {
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
  const [_ctx] = useContext(InputContext)

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
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
        />

        <>
          <>
            <div className="lg:hidden">
              <MobileList inputs={currentItems} />
            </div>
            <div className="hidden lg:flex">
              <DesktopList inputs={currentItems} />
            </div>
          </>
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
