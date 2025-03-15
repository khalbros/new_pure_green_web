import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IFarmer } from "../../../../interfaces/farmer"
import { updateFarmerAction } from "../../../../store/actions/farmer"
import { useAppDispatch } from "../../../../store"
import React from "react"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  farmer?: IFarmer
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  farmer,
}: IProps) {
  const dispatchAction = useAppDispatch()

  // handle farmer status
  const handleStatus = (farmer: IFarmer) => {
    dispatchAction(
      updateFarmerAction(
        {
          ...farmer,
          isApproved:
            farmer.isApproved === "APPROVED" ? "REJECTED" : "APPROVED",
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
          alt="delete farmer"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to{" "}
          {farmer?.isApproved === "APPROVED" ? "reject" : "approve"} farmer with
          the name “
          {farmer?.first_name + " " + farmer?.other_name &&
            farmer?.other_name + " " + farmer?.last_name}
          ”
        </p>
        <Button
          onClick={() => handleStatus(farmer!)}
          className="bg-green-600 w-60p mx-auto block mb-16"
        >
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
