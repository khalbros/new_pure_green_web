import React from "react"
import {Outlet, useLocation} from "react-router-dom"
import Sidebar from "../../components/sidebar"
import Header from "../../components/header"

const Layout = () => {
  const [screenSize, setScreenSize] = React.useState(getScreenSize())
  const [open, setOpen] = React.useState(screenSize.width > 1024)
  const location = useLocation()

  function getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  React.useEffect(() => {
    const resize = () => setScreenSize(getScreenSize())
    screenSize.width < 1024 ? setOpen(false) : setOpen(true)

    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [screenSize, location.pathname])

  const showNav = () => setOpen(!open)

  return (
    <div className="max-h-[100vh] max-w-[100vw] bg-white relative scrollbar-hidden">
      {open && <Sidebar handleClose={showNav} />}

      <main
        className={`h-[100vh] ${
          open ? "lg:ml-[20rem] lg:w-[calc(100% - 20rem)]" : "w-full"
        } relative scrollbar-hidden`}>
        <Header open={open} handleClose={showNav} />
        <div className="h-[90vh] lg:h-[84.7vh] overflow-y-auto p-2">
          <div className="pb-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
