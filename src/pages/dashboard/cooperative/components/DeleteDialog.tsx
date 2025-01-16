import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { deleteCooperativeAction } from "../../../../store/actions/cooperative"
import { useAppDispatch } from "../../../../store"
import { ICooperative } from "../../../../interfaces/cooperative"
import { useLocation, useNavigate } from "react-router-dom"

interface IProps {
  openDelete: boolean
  toggleDelete: () => void
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
  cooperative?: ICooperative
}
function DeleteDialog({
  openDelete,
  toggleDelete,
  setOpenDelete,
  cooperative,
}: IProps) {
  const dispatchAction = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  // Delete cooperative
  const handleDelete = () => {
    dispatchAction(
      deleteCooperativeAction({ ...cooperative }, () => {
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
          alt="delete cooperative"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to DELETE “{cooperative?.name}”
        </p>
        <Button
          onClick={() => handleDelete()}
          className="bg-green-600 w-60p mx-auto block mb-16"
        >
          Delete
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default DeleteDialog
