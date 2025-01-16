import { MdMenu } from "react-icons/md"
import logo from "../../assets/puregreen-logo.png"
function Header({
  handleClose,
  open,
}: {
  handleClose: VoidFunction
  open: boolean
}) {
  return (
    <nav
      className={`${
        !open ? "justify-between md:justify-start" : ""
      } sticky bg-white flex items-center gap-4 w-full px-4 py-2 lg:px-8 lg:py-4 border-b-[2.5px] border-green-600`}>
      {!open && (
        <MdMenu
          className="text-3xl lg:text-5xl text-green-700"
          onClick={() => handleClose()}
        />
      )}
      <div className="flex gap-1 lg:gap-3 items-center">
        <img
          src={logo}
          alt="app-logo"
          className="object-contain object-center w-12 lg:w-24 h-12 lg:h-24"
        />
        <p
          className={`${
            open ? "w-full text-right" : ""
          } text-xl lg:text-3xl text-gray-800 leading-10 font-extrabold`}>
          PureGreen{" "}
          <span className="text-green-600 font-bold italic">
            {" "}
            Agro-chemicals{" "}
          </span>
        </p>
      </div>
    </nav>
  )
}

export default Header
