/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext, useEffect, useState} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {ITeam} from "../../../interfaces/team"
import {TeamContext} from "."
import {IUser} from "../../../interfaces/user"
import {fetchData} from "../../../utils"
import {IFarmer} from "../../../interfaces/farmer"
import {toast} from "react-toastify"
import useFetch from "../../../hooks/useFetch"
import {ICooperative} from "../../../interfaces/cooperative"

interface IProps {
  open: boolean
  close: () => void
  team?: ITeam
}

const TeamDetails: React.FC<IProps> = (props) => {
  const {data} = useFetch(`/cooperative/members/${props.team?._id}`)
  const [members, setMembers] = useState<IFarmer[]>(data)
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(TeamContext)

  const handleEditTeam = () => {
    dispatch(props.team)
    navigate("/dashboard/team-management/edit")
  }

  useEffect(() => {
    fetchData(`/team/members/${props.team?._id}`)
      .then(
        (res) => {
          setMembers(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [data])

  return (
    <Drawer
      open={props.open}
      size={700}
      onClose={props.close}
      placement="right"
      className="overflow-y-scroll">
      <div className="px-6 py-10">
        <div className="flex justify-between mb-12">
          <h3 className="font-[500]">Team's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Team details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-1 flex-col gap-4 col-span-4 lg:col-span-3 whitespace-nowrap">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Team Name:</span>
              {props.team?.name}
            </p>

            {props.team?.supervisor && (
              <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                <span className="text-gray-600">Supervisor:</span>
                <span className="capitalize">
                  {(props.team?.supervisor as IUser)?.name}
                </span>
              </p>
            )}
            {props.team?.cooperativies ? (
              <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                <span className="text-gray-600">Cooperativies:</span>
                <span className="flex flex-wrap gap-1">
                  {(props.team?.cooperativies as ICooperative[])?.map(
                    (coop) => (
                      <span className="capitalize" key={coop._id}>
                        {coop.name},{" "}
                      </span>
                    )
                  )}
                </span>
              </p>
            ) : null}
            {members && members.length > 0 ? (
              <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                <span className="text-gray-600">Members:</span>
                <span className="flex flex-wrap gap-1">
                  {members?.map((farmer) => (
                    <span className="capitalize" key={farmer._id}>
                      {farmer.first_name},{" "}
                    </span>
                  ))}
                </span>
              </p>
            ) : null}
          </div>
          <div className="" onClick={handleEditTeam}>
            <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
              <AiFillEdit /> Edit
            </span>
          </div>
        </div>
      </div>
      {/* Team activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Team's Statistics</h4>
        {/* <div className="p-4 w-full border rounded-lg">
          <div className="flex gap-[11px] mb-4">
            <p className="text-gray-700 flex-1">No of rides completed </p>
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
        </div> */}
      </div>
    </Drawer>
  )
}

export default TeamDetails
