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
import { FaEye } from "react-icons/fa"
import { TfiMore } from "react-icons/tfi"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
// import {useNavigate} from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import { MdCancel, MdDeleteForever } from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "./emptyResult"
import { ICommodity } from "../../../interfaces/commodity"
import { WCommodityContext } from "."
import useFetch from "../../../hooks/useFetch"
import { fetchData, getUser } from "../../../utils"
import {
  deleteWHCommodityAction,
  updateCommodityAction,
} from "../../../store/actions/commodity"
import { useAppDispatch, useAppSelector } from "../../../store"
import { commoditySelector } from "../../../store/slices/commodity"
import { toast } from "react-toastify"
import CommodityDetails from "./details"
import { IGrade } from "../../../interfaces/grade"

interface Commodities {
  commodity: ICommodity
  grade: IGrade
  quantity: number
  net_weight: number
  weight: number
  _id: string
}

const WCommodityTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [commodities, setCommodities] = useState<Commodities[]>()
  const [commodity, setCommodity] = useState<ICommodity>()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(commodities)
  const [_ctx] = useContext(WCommodityContext)
  const dispatchAction = useAppDispatch()
  // const navigate = useNavigate()
  const commodityState = useAppSelector(commoditySelector)
  const { data, error, loading, message } = useFetch(
    `/commodity/warehouse/${currentUser?.warehouse?._id}`
  )

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setCommodities(data)
      return
    }
    const result = (data as Commodities[])?.filter((commodity) =>
      commodity.commodity.name?.toLowerCase().includes(value.toLowerCase())
    )
    setCommodities(result)
  }

  // set commodity context and navigate to edit commodity
  // const handleEdit = (commodity: ICommodity) => {
  //   dispatch(commodity)
  //   navigate("/dashboard/commodity-management/edit")
  // }
  // set commodity context and navigate to edit commodity
  const handleStatus = (commodity: ICommodity) => {
    dispatchAction(
      updateCommodityAction(
        { ...commodity, isApproved: !commodity.isApproved },
        () => toggleDiaglog(commodity)
      )
    )
  }

  // open or close delete dialog
  const toggleDeleteDialog = (commodity?: ICommodity) => {
    if (commodity) {
      setCommodity(commodity)
    }
    setOpenDelete(!openDelete)
  }
  // handle delete
  const handleDelete = (commodity: ICommodity) => {
    dispatchAction(
      deleteWHCommodityAction(
        { id: currentUser?.warehouse?._id, commodity_id: commodity._id },
        () => setOpenDelete(!openDelete)
      )
    )
  }

  // open drawer with commoditys details
  const toggleDrawer = (commodity?: ICommodity) => {
    if (commodity) {
      setCommodity(commodity)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDiaglog = (commodity?: ICommodity) => {
    if (commodity) {
      setCommodity(commodity)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setCommodities(data)
    }
    fetchData(`/commodity/warehouse/${currentUser?.warehouse?._id}`)
      .then(
        (res) => setCommodities(res.data),
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [data, dispatchAction, commodityState.isLoading])
  console.log(commodities)

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Commodity"
            image={AddUser}
            path="/dashboard/commodity-management/add"
          />
        }>
        {/* <Button
          onClick={() => navigate("/dashboard/commodity-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Add New Commodity
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
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">
                    S/N
                    {/* <input type="checkbox" /> */}
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Commodity's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Grade
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Gross-weight {"(kg)"}
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Quantity {"(bags)"}
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((commodity, key) => (
                  <tr
                    key={key}
                    className={`divide-y capitalize even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">
                      {commodity.commodity.name}
                    </td>
                    <td className="p-3 font-bold">{commodity.grade.name}</td>
                    <td className="p-3 font-bold">{commodity.weight}</td>
                    <td className="p-3 font-bold">{commodity.quantity}</td>
                    <td className="p-3">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem
                            className="border-b-2 inline-flex gap-2"
                            onClick={() => toggleDrawer(commodity)}>
                            <FaEye size={16} /> View details
                          </MenuItem>
                          {/* <MenuItem
                            onClick={() => handleEdit(commodity)}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem> */}

                          <MenuItem
                            onClick={() => toggleDeleteDialog(commodity)}
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
                onClick={() => toggleDiaglog(commodity!)}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete commodity"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to{" "}
              {commodity?.isApproved ? "Reject" : "Approve"} “{commodity?.name}”
            </p>
            <Button
              onClick={() => handleStatus(commodity!)}
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
              Are you sure you want to DELETE “{commodity?.name}”
            </p>
            <Button
              onClick={() => handleDelete(commodity!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        <CommodityDetails
          commodity={commodity}
          open={openDrawer}
          close={toggleDrawer}
        />
      </QueryResult>
    </>
  )
}

export default WCommodityTable
