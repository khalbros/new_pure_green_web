import {Dialog, DialogBody} from "@material-tailwind/react"
import {MdCancel} from "react-icons/md"
import SuccessIcon from "../../../../assets/icons/success.svg"

interface ModalProps {
  openDialog: boolean
  toggleDiaglog: () => void
}
function SuccessModal({openDialog, toggleDiaglog}: ModalProps) {
  return (
    <Dialog size="sm" open={openDialog} handler={toggleDiaglog}>
      <DialogBody className="">
        <div className="flex justify-end">
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={() => toggleDiaglog()}
            color="#424242"
          />{" "}
        </div>
        <img
          src={SuccessIcon}
          className="w-[106.67px] h-[106.67px] mx-auto mb-7 block"
          alt="success icon"
        />
        <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
          You have successfully changed your password
        </p>
      </DialogBody>
    </Dialog>
  )
}

export default SuccessModal
