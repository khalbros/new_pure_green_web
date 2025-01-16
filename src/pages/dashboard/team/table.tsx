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
import {FaEye} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillDelete,
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
import {ITeam} from "../../../interfaces/team"
import useFetch from "../../../hooks/useFetch"
import {TeamContext} from "./"
import {ICooperative} from "../../../interfaces/cooperative"
import {IUser} from "../../../interfaces/user"
import TeamDetails from "./details"

const TeamTable = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [teams, setTeams] = useState<ITeam[]>()
  const [team, setTeam] = useState<ITeam>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(teams)
  const [_ctx, dispatch] = useContext(TeamContext)
  const {data, error, loading, message} = useFetch("/team")
  const navigate = useNavigate()

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setTeams(data)
      return
    }
    const result = (data as ITeam[])?.filter(
      (team) =>
        team.name?.toLowerCase().includes(value.toLowerCase()) ||
        (team.supervisor as IUser).name
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setTeams(result)
  }

  // set team context and navigate to edit team
  const handleEdit = (team: ITeam) => {
    dispatch(team)
    navigate("edit")
  }

  // open drawer with teams details
  const toggleDrawer = (team?: ITeam) => {
    if (team) {
      setTeam(team)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDiaglog = (team?: ITeam) => {
    if (team) {
      setTeam(team)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setTeams(data)
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
            item="Team"
            image={AddUser}
            path="/dashboard/team-management/add"
          />
        }>
        <Button
          onClick={() => navigate("/dashboard/team-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Add Team
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
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">
                    {/* <input type="checkbox" /> */}
                    S/N
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Team's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Team Supervisor
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Cooperativies
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((team, key) => (
                  <tr
                    key={key}
                    className={`divide-y even:bg-[#FAFAFA] capitalize`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">{team.name}</td>
                    <td className="p-3">{(team.supervisor as IUser).name}</td>
                    <td className="p-3 flex gap-2">
                      <p className="grid grid-flow-row items-start gap-1 place-content-start capitalize">
                        {(team.cooperativies as ICooperative[])?.map(
                          (cooperative) => (
                            <span>{cooperative.name},</span>
                          )
                        )}
                      </p>
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
                            className="border-b-2 inline-flex gap-2"
                            onClick={() => toggleDrawer(team)}>
                            <FaEye size={16} /> View details
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleEdit(team)}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {}}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillDelete size={16} color="red" /> Delete
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
              alt="delete team"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to delete team with the name “{team?.name}”
            </p>
            <Button
              onClick={() => toggleDiaglog(team!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        <TeamDetails team={team} open={openDrawer} close={toggleDrawer} />
      </QueryResult>
    </>
  )
}

export default TeamTable
