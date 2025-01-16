import React from "react"

interface IProps {
  item: string
  image: string
  path?: string
}

const EmptyResult: React.FC<IProps> = (props) => {
  return (
    <div className="h-auto w-full grid gap-4 mt-12 place-content-center text-center">
      <img
        src={props.image}
        alt="add user illustration"
        className="h-full w-full"
      />

      <p>No {props.item} in warehouse</p>
    </div>
  )
}

export default EmptyResult
