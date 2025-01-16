import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IUser } from "../../../../interfaces/user"
import { useAppDispatch } from "../../../../store"
import React from "react"
import { updateUserAction } from "../../../../store/actions/users"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  user?: IUser
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  user,
}: IProps) {
  const dispatchAction = useAppDispatch()

  // handle user status
  const handleStatus = (user: IUser) => {
    dispatchAction(
      updateUserAction(
        {
          ...user,
          isEnable: !user.isEnable,
        },
        () => setOpenDialog(!openDialog)
      )
    )
  }
  return (
    <Dialog size="sm" open={openDialog} handler={toggleDiaglog}>
      <DialogBody className="">
        <div className="flex justify-end">
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={toggleDiaglog}
          />{" "}
        </div>
        <img
          src={confirmAction}
          className="w-[120px] mx-auto mb-7 block"
          alt="delete user"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to {user?.isEnable ? "disable" : "activate"} “
          {user?.name}”
        </p>
        <Button
          onClick={() => handleStatus(user!)}
          className="bg-green-600 w-60p mx-auto block mb-16 tracking-wide text-base">
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
