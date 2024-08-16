import s from "./styles.module.scss";
import ModalWrapper from "../ModalWrapper";

export default function RemovingCommentModal({ cancelModal, deletePost, post }) {
    const payload = {
        token: post.token,
        imageUrl: post.imageUrl
    }

    return (
        <ModalWrapper cancelModal={cancelModal}>
            {deletePost && (
                <p onClick={() => deletePost(payload, cancelModal)} className={s.remove_btn}>Delete</p>
            )}
            <p onClick={cancelModal} className={s.cancel_modal_btn}>Cancel</p>
        </ModalWrapper>
    )
}