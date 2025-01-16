import {Dialog, DialogBody} from "@material-tailwind/react"
import {MdCancel} from "react-icons/md"
import RecoverySent from "../../../../assets/illustrations/password-recovery.png"

interface ModalProps {
  openDialog: boolean
  toggleDiaglog: () => void
}
function RecoverySentModal({openDialog, toggleDiaglog}: ModalProps) {
  return (
    <Dialog size="md" open={openDialog} handler={toggleDiaglog}>
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
          src={RecoverySent}
          className="w-[106.67px] h-[106.67px] mx-auto my-10 block"
          alt="success icon"
        />
        <p className="mx-auto text-sm text-center max-w-[460px] text-gray-800 mb-7">
          An email has been sent to your email address. Check the inbox of your
          email account for the account passord recovery link provided.
        </p>
      </DialogBody>
    </Dialog>
  )
}

export default RecoverySentModal
