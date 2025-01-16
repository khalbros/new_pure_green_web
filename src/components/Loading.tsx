import { TbLoader3 } from "react-icons/tb"

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <TbLoader3
        className="animate-spin duration-100 text-[5rem] md:text-[8rem]"
        color="green"
      />
    </div>
  )
}

export default Loading
