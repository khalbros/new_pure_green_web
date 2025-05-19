import React, { useMemo } from "react"
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Chip,
} from "@material-tailwind/react"
import { HiPresentationChartBar } from "react-icons/hi"
import { IoMdPower } from "react-icons/io"
import { MdClose, MdSettings } from "react-icons/md"
import { routes } from "../../routes"
import Links from "./Links"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../store"
import { logoutAction } from "../../store/actions/auth.action"
import { getUser } from "../../utils"

export default function Sidebar({
  handleClose,
}: {
  handleClose: VoidFunction
}) {
  const [open, setOpen] = React.useState<string>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const user = useMemo(() => JSON.parse(getUser()!), [])
  const links = useMemo(() => getLinks(), [])

  function getLinks() {
    return routes.find((route) => route.layout === user?.role?.toLowerCase())
  }

  const handleOpen = (value: string) => {
    setOpen(open === value ? "" : value)
  }

  function handleLogout() {
    dispatch(logoutAction(() => navigate("/auth")))
  }

  return (
    <Card
      className="fixed z-50 top-4 left-4 h-[calc(100vh-2rem)] w-fit lg:w-full lg:max-w-[20rem] p-3 shadow-lg lg:drop-shadow-xl shadow-green-100 border border-gray-100 overflow-hidden overflow-y-auto scrollbar-2"
      translate="yes"
    >
      <div className="flex items-baseline justify-between mb-2 p-2">
        <div className="flex flex-col items-baseline justify-center space-x-2 capitalize">
          {user?.role === "WAREHOUSE MANAGER" && (
            <Typography
              variant="h6"
              className="text-gray-400 md:text-sm truncate overflow-ellipsis"
            >
              {user?.warehouse.name}
            </Typography>
          )}
          <Typography variant="h5" className="text-green-600 md:text-lg">
            {user?.role}
          </Typography>
        </div>
        <MdClose
          className="text-3xl lg:text-4xl text-green-600"
          onClick={() => handleClose()}
        />
      </div>
      <Chip
        color="green"
        value={user?.name}
        className="text-white text-center rounded-full tracking-wide -mt-1"
      />
      <hr className="my-2 border-green-600" />
      <List className="transition-transform">
        <ListItem
          className="p-2 md:p-3 "
          onClick={() => {
            navigate("/dashboard")
            handleOpen("1")
          }}
        >
          <ListItemPrefix>
            <HiPresentationChartBar className="h-5 w-5 text-green-600 hover:bg-green-200 focus:bg-green-100 focus:text-green-900" />
          </ListItemPrefix>
          <Typography
            color="green"
            className="mr-auto font-normal md:font-bold"
          >
            Dashboard
          </Typography>
        </ListItem>

        {links?.children?.map((link) => (
          <Links
            key={link.name}
            link={link}
            open={open}
            handleOpen={handleOpen}
          />
        ))}

        <hr className="my-2 border-green-50" />

        {/* <ListItem className="text-green-600 hover:bg-green-200 focus:bg-green-100 focus:text-green-900">
          <ListItemPrefix className="text-green-600 focus:text-green-900">
            <MdMoveToInbox className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem> */}

        <ListItem
          className="text-green-600 hover:bg-green-200 focus:bg-green-100 focus:text-green-900"
          onClick={() => {
            navigate("/dashboard/settings/profile")
            handleOpen("1")
          }}
        >
          <ListItemPrefix className="text-green-600 focus:text-green-900">
            <MdSettings className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>

        <ListItem
          onClick={handleLogout}
          className="text-green-600 hover:bg-green-200 focus:bg-green-100 focus:text-green-900"
        >
          <ListItemPrefix className="text-green-600 focus:text-green-900">
            <IoMdPower className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  )
}
