import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IUser } from "../../../../interfaces/user"
import { useAppDispatch } from "../../../../store"
import { useLocation, useNavigate } from "react-router-dom"
import { deleteUserAction } from "../../../../store/actions/users"

interface IProps {
  openDelete: boolean
  toggleDelete: () => void
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
  user?: IUser
}
function DeleteDialog({
  openDelete,
  toggleDelete,
  setOpenDelete,
  user,
}: IProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatchAction = useAppDispatch()
  // Delete user
  const handleDelete = () => {
    dispatchAction(
      deleteUserAction({ ...user }, () => {
        setOpenDelete(!openDelete)
        if (location.pathname.includes("/details")) {
          navigate(-1)
        }
      })
    )
  }
  return (
    <Dialog size="sm" open={openDelete} handler={toggleDelete}>
      <DialogBody className="">
        <div className="flex justify-end">
          {" "}
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={() => toggleDelete()}
          />{" "}
        </div>
        <img
          src={confirmAction}
          className="w-[120px] mx-auto mb-7 block"
          alt="delete user"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to DELETE “{user?.name}”
        </p>
        <Button
          onClick={() => handleDelete()}
          className="bg-green-600 w-60p mx-auto block mb-16 tracking-wide text-base">
          Delete
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default DeleteDialog
