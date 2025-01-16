import React from "react"
import Links from "./Links"
import {IRoute} from "../../routes"
interface IProps {
  routes: IRoute[]
  title: string
}

const NavBar: React.FC<IProps> = ({title, routes}) => {
  return (
    <div className="">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-7">
        {title}
      </h3>
      <Links routes={routes} />
    </div>
  )
}

export default NavBar
