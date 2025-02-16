import { Button, Dialog, DialogBody } from "@material-tailwind/react"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { MdCancel } from "react-icons/md"
import { IInput } from "../../../../interfaces/input"
import { approveInputAction } from "../../../../store/actions/input"
import { useAppDispatch } from "../../../../store"
import React from "react"
import { useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"

interface IProps {
  openDialog: boolean
  toggleDiaglog: () => void
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  input?: IInput
}
function ApprovalDialog({
  openDialog,
  toggleDiaglog,
  setOpenDialog,
  input,
}: IProps) {
  const dispatchAction = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // handle input status
  const handleStatus = (input: IInput) => {
    dispatchAction(
      approveInputAction(
        {
          ...input,
          isApproved: !input.isApproved,
        },
        () => {
          queryClient.invalidateQueries(["inputs"], {
            exact: true,
          })

          setOpenDialog(!openDialog)
          navigate(-1)
        }
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
          alt="delete input"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          Are you sure you want to {input?.isApproved ? "reject" : "approve"}{" "}
          input with the name “{input?.name}”
        </p>
        <Button
          onClick={() => handleStatus(input!)}
          className="bg-green-600 w-60p mx-auto block mb-16 tracking-wider ">
          Confirm
        </Button>
      </DialogBody>
    </Dialog>
  )
}

export default ApprovalDialog
