/* eslint-disable @typescript-eslint/no-unused-vars */
import {useContext, useEffect, useState} from "react"
import {
  Button,
  Dialog,
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
import {FaEye} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import noData from "../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel} from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"

import usePagination from "../../../hooks/usePagination"

import QueryResult from "../../../components/queryResult"
import {IVisitation} from "../../../interfaces/visitation"
import useFetch from "../../../hooks/useFetch"
import {VisitationContext} from "./"
import VisitationDetails from "./details"
import EmptyResult from "./emptyResult"
import {IUser} from "../../../interfaces/user"
import {IWarehouse} from "../../../interfaces/warehouse"

const VisitationTable = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [visitations, setVisitations] = useState<IVisitation[]>()
  const [visitation, setVisitation] = useState<IVisitation>()

  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(visitations)
  const [_ctx, dispatch] = useContext(VisitationContext)
  const {data, error, loading, message} = useFetch("/visitation")
  const navigate = useNavigate()

  // search
  // const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   const {value} = e.target
  //   if (!value) {
  //     setVisitations(data)
  //     return
  //   }
  //   const result = (data as IVisitation[])?.filter((visitation) =>
  //     visitation.farmer_id?.toLowerCase().includes(value.toLowerCase())
  //   )
  //   setVisitations(result)
  // }

  // set user context and navigate to edit user
  const handleEdit = (visitation: IVisitation) => {
    dispatch(visitation)
    navigate("edit")
  }

  // open drawer with users details
  const toggleDrawer = (visitation?: IVisitation) => {
    if (visitation) {
      setVisitation(visitation)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDiaglog = (visitation?: IVisitation) => {
    if (visitation) {
      setVisitation(visitation)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setVisitations(data)
    }
  }, [data])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Visitation"
            image={noData}
            path="/dashboard/visitation-management/add"
          />
        }>
        <Button
          onClick={(_) => navigate("/dashboard/visitation-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 my-4">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Submit Visitation
        </Button>
        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">S/N</th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Farmer's ID
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Warehouse
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Supervisor
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Commodities
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Visitation
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Comment
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((visitation, key) => (
                  <tr key={key}>
                    <td className="w-10 pl-3">{key + 1}</td>

                    <td className="p-3 font-bold whitespace-nowrap">
                      {visitation.farmer_id}
                    </td>
                    <td className="p-3">
                      {
                        (
                          (visitation.visited_by as IUser)
                            ?.warehouse as IWarehouse
                        )?.name
                      }
                    </td>
                    <td className="p-3">
                      {(visitation.visited_by as IUser)?.name}
                    </td>
                    <td className="p-3">
                      {" "}
                      <span className="flex flex-col gap-1">
                        {visitation?.commodity?.map((commodity) => (
                          <span className="capitalize" key={commodity}>
                            {commodity}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="p-3">{visitation.visitation_count}</td>
                    <td className="p-3">{visitation.comment}</td>
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
                            onClick={() => toggleDrawer(visitation)}>
                            <FaEye size={16} /> View details
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleEdit(visitation)}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
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
              Are you sure you want to disable visitation with the name “
              {visitation?.farmer_id}”
            </p>
            <Button
              onClick={() => {}}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        <VisitationDetails
          visitation={visitation}
          open={openDrawer}
          close={toggleDrawer}
        />
      </QueryResult>
    </>
  )
}

export default VisitationTable
