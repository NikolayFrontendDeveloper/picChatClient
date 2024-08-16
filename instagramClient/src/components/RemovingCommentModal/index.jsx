import s from "./styles.module.scss";
import ModalWrapper from "../ModalWrapper";

export default function RemovingCommentModal({ cancelModal, removeComment, id }) {
    return (
        <ModalWrapper cancelModal={cancelModal}>
            <p onClick={() => removeComment(id)} className={s.remove_btn}>Delete</p>
            <p onClick={cancelModal} className={s.cancel_modal_btn}>Cancel</p>
        </ModalWrapper>
    )
}