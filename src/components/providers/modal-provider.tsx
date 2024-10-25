import { CreateServerModal } from "../modals/create-server-modal";
import { InviteModal } from "../modals/invite-modal";

const ModalProvider = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex item-center justify-center z-[999] pointer-events-none flex justify-center items-center ">
      <CreateServerModal />
      <InviteModal />
    </div>
  );
};

export default ModalProvider;
