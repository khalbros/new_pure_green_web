import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { ICooperative } from "../../../../interfaces/cooperative"
import { updateCooperativeAction } from "../../../../store/actions/cooperative"
import { useAppDispatch } from "../../../../store"
import React from "react"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  cooperative?: ICooperative
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  cooperative,
}: IProps) {
  const dispatchAction = useAppDispatch()

  // handle cooperative status
  const handleStatus = (cooperative: ICooperative) => {
    dispatchAction(
      updateCooperativeAction(
        {
          ...cooperative,
          isApproved: !cooperative.isApproved,
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
          alt="delete cooperative"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to{" "}
          {cooperative?.isApproved ? "reject" : "approve"} cooperative with the
          name “{cooperative?.name}”
        </p>
        <Button
          onClick={() => handleStatus(cooperative!)}
          className="bg-green-600 w-60p mx-auto block mb-16"
        >
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
