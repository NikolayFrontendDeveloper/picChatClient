import s from "./styles.module.scss";
import ModalWrapper from "../ModalWrapper";

export default function AvaModal({ cancelModal, removeAva, handleFileChange }) {
    return (
        <ModalWrapper cancelModal={cancelModal}>
            <p id={s.ava_modal_description}>Change Ava</p>
            <input
                type="file"
                onChange={handleFileChange}
                id="fileInput"
                style={{ display: 'none' }}
            />
            <button className={s.choose_file_btn} onClick={() => document.getElementById('fileInput').click()}>
                Choose File
            </button>
            <p onClick={removeAva} className={s.remove_ava_btn}>Remove Ava</p>
            <p onClick={cancelModal} className={s.cancel_modal_btn}>Cancel</p>
        </ModalWrapper>
    )
}