import React from "react"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IUser } from "../../../../interfaces/user"
import { useAppDispatch } from "../../../../store"
import { resetUserPasswordAction } from "../../../../store/actions/users"

interface IProps {
  openDialogReset: boolean
  toggleDiaglogReset: () => void
  setOpenReset: React.Dispatch<React.SetStateAction<boolean>>
  user?: IUser
}

function ResetDialog({ openDialogReset, toggleDiaglogReset, user }: IProps) {
  const dispatchAction = useAppDispatch()
  return (
    <Dialog size="sm" open={openDialogReset} handler={toggleDiaglogReset}>
      <DialogBody className="">
        <div className="flex justify-end">
          {" "}
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={() => toggleDiaglogReset()}
          />{" "}
        </div>
        <img
          src={confirmAction}
          className="w-[140px] mx-auto mb-7 block"
          alt="delete user"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to Reset this user's “{user?.name}” password?
        </p>
        <Button
          onClick={() => {
            dispatchAction(
              resetUserPasswordAction(
                { email: user?.email, password: "12345" },
                () => toggleDiaglogReset()
              )
            )
          }}
          className="bg-green-600 w-60p mx-auto block mb-16 tracking-wide text-base">
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ResetDialog
