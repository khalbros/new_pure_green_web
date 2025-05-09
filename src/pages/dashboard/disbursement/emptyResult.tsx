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
        className="h-25 w-25"
      />

      <p>No {props.item} created yet</p>
      {user?.role === "WAREHOUSE ADMIN" && (
        <>
          <p>
            Click <strong>the button</strong> for {props.item}.
          </p>
          <Button
            onClick={() => navigate(`${props.path}`)}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[16px] lg:text-[28px]" />
            Book New Loan
          </Button>
        </>
      )}
    </div>
  )
}

export default EmptyResult
