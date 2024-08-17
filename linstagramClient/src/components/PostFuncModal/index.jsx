import s from "./styles.module.scss";
import ModalWrapper from "../ModalWrapper";
import { useState } from "react";

export default function RemovingCommentModal({ cancelModal, deletePost, post }) {
    const [isUserPost, setIsUserPost] = useState(post.token === localStorage.getItem('id'));
    const payload = {
        token: post.token,
        imageUrl: post.imageUrl
    }

    return (
        <ModalWrapper cancelModal={cancelModal}>
            {isUserPost && (
                <p onClick={() => deletePost(payload, () => {
                    cancelModal();
                })} className={s.remove_btn}>Delete</p>
            )}
            <p onClick={cancelModal} className={s.cancel_modal_btn}>Cancel</p>
        </ModalWrapper>
    )
}