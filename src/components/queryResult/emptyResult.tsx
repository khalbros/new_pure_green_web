import React from "react"
import {useNavigate} from "react-router-dom"
import {MdAdd} from "react-icons/md"

import {Button} from "@material-tailwind/react"
interface IProps {
  item: string
  image: string
  path?: string
}

const EmptyResult: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  return (
    <div className="h-auto w-full grid gap-6 mt-16 place-content-center text-center">
      <img
        src={props.image}
        alt="add user illustration"
        className="h-96 w-96 self-center"
      />
      <p>No {props.item} created yet</p>
      <p>
        Click <strong>create {props.item}</strong> to add a new {props.item}.
      </p>
      <Button
        onClick={() => navigate(`${props.path}`)}
        className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
        <MdAdd className="text-[18px] lg:text-[30px]" />
        {"create " + props.item}
      </Button>
    </div>
  )
}

export default EmptyResult
