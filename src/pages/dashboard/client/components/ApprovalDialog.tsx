import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IClient } from "../../../../interfaces/client"
import { updateClientAction } from "../../../../store/actions/client"
import { useAppDispatch } from "../../../../store"
import React from "react"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  client?: IClient
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  client,
}: IProps) {
  const dispatchAction = useAppDispatch()

  // handle client status
  const handleStatus = (client: IClient) => {
    dispatchAction(
      updateClientAction(
        {
          ...client,
          isApproved: !client.isApproved,
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
          alt="delete client"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to {client?.isApproved ? "reject" : "approve"}{" "}
          client with the name “{client?.name + " " + client?.client_id}”
        </p>
        <Button
          onClick={() => handleStatus(client!)}
          className="bg-green-600 w-60p mx-auto block mb-16">
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
