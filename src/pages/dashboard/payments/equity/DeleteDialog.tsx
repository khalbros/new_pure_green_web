import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IFarmer } from "../../../../interfaces/farmer"
import { deleteFarmerAction } from "../../../../store/actions/farmer"
import { useAppDispatch } from "../../../../store"
import { useLocation, useNavigate } from "react-router-dom"

interface IProps {
  openDelete: boolean
  toggleDelete: () => void
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
  farmer?: IFarmer
}
function DeleteDialog({
  openDelete,
  toggleDelete,
  setOpenDelete,
  farmer,
}: IProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatchAction = useAppDispatch()
  // Delete farmer
  const handleDelete = () => {
    dispatchAction(
      deleteFarmerAction({ ...farmer }, () => {
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
          alt="delete farmer"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to DELETE “
          {farmer?.first_name + " " + farmer?.other_name &&
            farmer?.other_name + " " + farmer?.last_name}
          ”
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
