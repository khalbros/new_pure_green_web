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
import {FaFilter} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel, MdDeleteForever} from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import {FiSearch} from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import {IProject} from "../../../interfaces/project"
import useFetch from "../../../hooks/useFetch"
import {ProjectContext} from "./"
import {IoMdCheckmarkCircle} from "react-icons/io"
import {
  deleteProjectAction,
  updateProjectAction,
} from "../../../store/actions/project"
import {useAppDispatch, useAppSelector} from "../../../store"
import {fetchData} from "../../../utils"
import {toast} from "react-toastify"
import {projectSelector} from "../../../store/slices/project"

const ProjectTable = () => {
  // const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [projects, setProjects] = useState<IProject[]>()
  const [project, setProject] = useState<IProject>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(projects)
  const [_ctx, dispatch] = useContext(ProjectContext)
  const {data, error, loading, message} = useFetch("/project")
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const projectState = useAppSelector(projectSelector)
  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setProjects(data)
      return
    }
    const result = (data as IProject[])?.filter(
      (project) =>
        project?.name?.toLowerCase().includes(value.toLowerCase()) ||
        project?.status?.toLowerCase().includes(value.toLowerCase()) ||
        project?.code?.toLowerCase().includes(value.toLowerCase())
    )
    setProjects(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (project: IProject) => {
    dispatch(project)
    navigate("edit")
  }

  const handleStatus = (project: IProject) => {
    dispatchAction(
      updateProjectAction(
        {
          ...project,
          status:
            project.status === "PENDING"
              ? "STARTED"
              : project.status === "ENDED"
              ? "STARTED"
              : "ENDED",
        },
        () => setOpenDialog(!openDialog)
      )
    )
  }
  // open drawer with users details
  // const toggleDrawer = (project?: IProject) => {
  //   if (project) {
  //     setProject(project)
  //   }
  //   setOpenDrawer(!openDrawer)
  // }

  // open or close delete dialog
  const toggleDiaglog = (project?: IProject) => {
    if (project) {
      setProject(project)
    }
    setOpenDialog(!openDialog)
  }

  // open or close delete dialog
  const toggleDelete = (project?: IProject) => {
    if (project) {
      setProject(project)
    }
    setOpenDelete(!openDelete)
  }
  // Delete farmer
  const handleDelete = (project: IProject) => {
    dispatchAction(
      deleteProjectAction({...project}, () => setOpenDelete(!openDelete))
    )
  }

  useEffect(() => {
    if (data) {
      setProjects(data)
    }
  }, [data])
  useEffect(() => {
    return () => {
      fetchData(`/project`)
        .then(
          (res) => setProjects(res.data),
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    }
  }, [dispatchAction, projectState.data])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Project"
            image={AddUser}
            path="/dashboard/project-management/add"
          />
        }>
        <Button
          onClick={() => navigate("/dashboard/project-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Schedule Project
        </Button>
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
          rightIcon={
            <Menu placement="bottom-start">
              <MenuHandler>
                <span className="search-filter">
                  <FaFilter /> Filter
                </span>
              </MenuHandler>
              <MenuList>
                <MenuItem>start</MenuItem>
                <MenuItem>end</MenuItem>
                <MenuItem>pending</MenuItem>
              </MenuList>
            </Menu>
          }
        />

        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">
                    {/* <input type="checkbox" /> */}
                    S/N
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Project's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Project Code
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((project, key) => (
                  <tr
                    key={key}
                    className={`divide-y even:bg-[#FAFAFA] capitalize`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">{project.name}</td>
                    <td className="p-3">{project.code}</td>
                    <td className="p-3">
                      {" "}
                      <span
                        className={`${
                          project.status === "STARTED"
                            ? "bg-green-500"
                            : project.status === "ENDED"
                            ? "bg-orange-600"
                            : "bg-blue-gray-500"
                        } flex w-fit px-2 md:px-4 md:py-1 text-center text-white uppercase rounded-full cursor-pointer truncate text-ellipsis`}>
                        {project.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem
                            onClick={() => handleEdit(project)}
                            className="inline-flex gap-2 border-b-2 items-center">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem>
                          {project?.status != "STARTED" ? (
                            <MenuItem
                              onClick={() => toggleDiaglog(project)}
                              className="inline-flex gap-2 border-b-2 items-center">
                              <IoMdCheckmarkCircle
                                size={16}
                                className="text-green-400"
                              />{" "}
                              Start
                            </MenuItem>
                          ) : (
                            <MenuItem
                              onClick={() => toggleDiaglog(project)}
                              className="inline-flex gap-2 border-b-2 items-center">
                              <MdCancel size={16} className="text-red-400" />{" "}
                              End
                            </MenuItem>
                          )}
                          <MenuItem
                            onClick={() => toggleDelete(project)}
                            className="inline-flex gap-2 border-b-2">
                            <MdDeleteForever
                              className="mr-2 inline"
                              color="red"
                              size={16}
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
              {project?.status != "START" ? "END" : "START"} project with the
              name “{project?.name}”
            </p>
            <Button
              onClick={() => handleStatus(project!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        {/* <Details user={user} open={openDrawer} close={toggleDrawer} /> */}

        {/* delete */}
        <Dialog size="sm" open={openDelete} handler={toggleDelete}>
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
              className="w-[120px] mx-auto mb-7 block"
              alt="delete farmer"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to DELETE “{project?.name}”
            </p>
            <Button
              onClick={() => handleDelete(project!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
      </QueryResult>
    </>
  )
}

export default ProjectTable
