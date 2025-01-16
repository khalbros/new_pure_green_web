import {Link, useLocation} from "react-router-dom"
import {IRoute} from "../../routes"
import React from "react"

interface IProps {
  routes: IRoute[]
}

const Links: React.FC<IProps> = ({routes}) => {
  const location = useLocation()

  const activeRoute = (pathName: string): boolean =>
    location.pathname.includes(pathName)
  return (
    <ul className="flex gap-12 mb-[14px]">
      {routes?.map((route, key) => (
        <Link
          key={key}
          to={route.path}
          className={`capitalize py-2 ${
            activeRoute(route.path)
              ? "border-b-2 border-b-green-700 text-green-700 font-bold"
              : "text-green-400"
          }`}>
          {route.name}
        </Link>
      ))}
    </ul>
  )
}

export default Links
