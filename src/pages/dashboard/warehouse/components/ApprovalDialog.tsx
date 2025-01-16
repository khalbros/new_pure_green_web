import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { updateWarehouseAction } from "../../../../store/actions/warehouse"
import { useAppDispatch } from "../../../../store"
import React from "react"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  warehouse?: IWarehouse
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  warehouse,
}: IProps) {
  const dispatchAction = useAppDispatch()

  // handle warehouse status
  const handleStatus = (warehouse: IWarehouse) => {
    dispatchAction(
      updateWarehouseAction(
        {
          ...warehouse,
          isApproved: !warehouse.isApproved,
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
          alt="delete warehouse"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to{" "}
          {warehouse?.isApproved ? "reject" : "approve"} warehouse with the name
          “{warehouse?.name}”
        </p>
        <Button
          onClick={() => handleStatus(warehouse!)}
          className="bg-green-600 w-60p mx-auto block mb-16 tracking-wider ">
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
