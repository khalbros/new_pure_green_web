/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../../assets/illustrations/no-data.png"
import { MdAdd, MdCancel } from "react-icons/md"
import DeleteUser from "../../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../../hooks/usePagination"
import Input from "../../../../components/form/input"
import QueryResult from "../../../../components/queryResult"
import { IWInput } from "../../../../interfaces/input"
import { InputContext } from "../"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { useAppDispatch } from "../../../../store"
import {
  approveWarehouseInputAction,
  deleteInputAction,
} from "../../../../store/actions/input"
import { fetchData, getUser } from "../../../../utils"
import { useQuery, useQueryClient } from "react-query"
import EmptyResult from "./emptyResult"
import MobileList from "./mobileList"
import DesktopList from "./desktopList"

const WarehouseInputTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["inputs", "warehouse"],
    queryFn: async () => {
      return fetchData("/input/by/warehouse").then((res) => res.data)
    },
  })

  const queryClient = useQueryClient()

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [inputs, setInputs] = useState<IWInput[]>(data)
  const [input, setInput] = useState<IWInput>()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(inputs)
  const [_ctx] = useContext(InputContext)

  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setInputs(data)
      return
    }
    const result = (data as IWInput[])?.filter(
      (input) =>
        input.input?.name?.toLowerCase().includes(value.toLowerCase()) ||
        String(input.quantity).includes(value.toLowerCase()) ||
        String(input.quantity_out).includes(value.toLowerCase()) ||
        (input?.warehouse as IWarehouse)?.name
          ?.toLowerCase()
          ?.includes(value.toLowerCase())
    )
    setInputs(result)
  }

  // open or close delete dialog
  const toggleDiaglog = (input?: IWInput) => {
    if (input) {
      setInput(input)
    }
    setOpenDialog(!openDialog)
  }

  // handle status
  const handleStatus = (input: IWInput) => {
    dispatchAction(
      approveWarehouseInputAction({ ...input }, () => {
        queryClient.invalidateQueries(["inputs", "warehouse"], { exact: true })
        setOpenDialog(!openDialog)
      })
    )
  }

  // open or close delete dialog
  const toggleDeleteDialog = (Input?: IWInput) => {
    if (Input) {
      setInput(Input)
    }
    queryClient.invalidateQueries(["inputs", "warehouse"], { exact: true })
    setOpenDelete(!openDelete)
  }
  // handle delete
  const handleDelete = (input: IWInput) => {
    dispatchAction(
      deleteInputAction({ ...input }, () => {
        queryClient.invalidateQueries(["inputs", "warehouse"], { exact: true })
        queryClient.invalidateQueries(["inputs", "warehouse"], { exact: true })
        setOpenDelete(!openDelete)
      })
    )
  }

  useEffect(() => {
    if (data) {
      setInputs(data)
    }
    queryClient.invalidateQueries(["inputs", "warehouse"], { exact: true })
  }, [data, dispatchAction, openDialog, openDelete])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? String(error) : ""}
        emptyResult={
          <EmptyResult
            item="Input"
            image={AddUser}
            path="/dashboard/warehouse-input-management/add"
          />
        }>
        {currentUser?.role === "WAREHOUSE MANAGER" && (
          <Button
            onClick={(_) =>
              navigate("/dashboard/warehouse-input-management/add")
            }
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" /> Add Input
          </Button>
        )}
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
      </QueryResult>
    </>
  )
}

export default WarehouseInputTable
