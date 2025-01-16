import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { MdAdd } from "react-icons/md"

import { Button } from "@material-tailwind/react"
import { getUser } from "../../../utils"
interface IProps {
  item: string
  image: string
  path?: string
}

const EmptyResult: React.FC<IProps> = (props) => {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const navigate = useNavigate()
  return (
    <div className="h-auto w-full grid gap-6 mt-16 place-content-center text-center">
      <img
        src={props.image}
        alt="add user illustration"
        className="h-full w-full"
      />

      <p>No {props.item} created yet</p>
      {(user?.role === "SUPER ADMIN" || user?.role === "DATA ANALYST") && (
        <>
          <p>
            Click <strong>the button</strong> to CREATE a new {props.item}.
          </p>

          <Button
            onClick={() => navigate(`${props.path}`)}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" />
            ADD NEW
          </Button>
        </>
      )}
    </div>
  )
}

export default EmptyResult
