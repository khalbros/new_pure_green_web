/* eslint-disable @typescript-eslint/no-unused-vars */
import {ChangeEvent, useContext, useEffect, useState} from "react"
import {
  Button,
  Dialog,
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
// import {FaEye} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel} from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import {FiSearch} from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import {IGrade} from "../../../interfaces/grade"
import {GradeContext} from "."
import useFetch from "../../../hooks/useFetch"

const GradeTable = () => {
  // const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [grades, setGrades] = useState<IGrade[]>()
  const [grade, setGrade] = useState<IGrade>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(grades)
  const [_ctx, dispatch] = useContext(GradeContext)
  const {data, error, loading, message} = useFetch("/grade")
  const navigate = useNavigate()

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setGrades(data)
      return
    }
    const result = (data as IGrade[])?.filter((grade) =>
      grade.name?.toLowerCase().includes(value.toLowerCase())
    )
    setGrades(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (grade: IGrade) => {
    dispatch(grade)
    navigate("edit")
  }

  // open drawer with users details
  // const toggleDrawer = (grade?: IGrade) => {
  //   if (grade) {
  //     setGrade(grade)
  //   }
  //   setOpenDrawer(!openDrawer)
  // }

  // open or close delete dialog
  const toggleDiaglog = (grade?: IGrade) => {
    if (grade) {
      setGrade(grade)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setGrades(data)
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
            item="Grade"
            image={AddUser}
            path="/dashboard/grade-management/add"
          />
        }>
        <Button
          onClick={(_) => navigate("/dashboard/grade-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5 whitespace-nowrap">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Add New Grade
        </Button>
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
                  <th className="w-10">
                    S/N
                    {/* <input type="checkbox" /> */}
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Grade's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Grade's % Deduction
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((grade, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">{grade.name}</td>
                    <td className="p-3">{grade.percentage}</td>
                    <td className="p-3">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          {/* <MenuItem
                            className="border-b-2 inline-flex gap-2"
                            onClick={() => toggleDrawer(grade)}>
                            <FaEye size={16} /> View details
                          </MenuItem> */}
                          <MenuItem
                            onClick={() => handleEdit(grade)}
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
              Are you sure you want to disable grade with the name “
              {grade?.name}”
            </p>
            <Button
              onClick={() => {}}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        {/* <Details user={user} open={openDrawer} close={toggleDrawer} /> */}
      </QueryResult>
    </>
  )
}

export default GradeTable
